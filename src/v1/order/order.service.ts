import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from 'src/v1/order/schemas/order.schema';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { UserDocument } from 'src/v1/users/schemas/user.schema';
import { CartService } from '../cart/cart.service';
import { OrderStatusEnum } from './enum/order-status.enum';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { CreateOrderDTO } from './dto/create-order.dto';
import { ProductWarehouseService } from '../product-warehouse/product-warehouse.service';
import { ProductsService } from '../product/product.service';
import { format } from 'date-fns';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<OrderDocument>,
    readonly cartService: CartService,
    readonly productWarehouseService: ProductWarehouseService,
    readonly productsService: ProductsService,
  ) {}
  async getMe(
    user: UserDocument,
    { page = 1, pageSize = 10, sort = { createdAt: 'asc' } }: GetQuery,
  ) {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const docs = await this.OrderModel.find({ user: user._id })
      .populate({
        path: 'item.product',
      })
      .skip(skip)
      .limit(limit)
      .sort(sort);
    const total = await this.OrderModel.count({ user: user._id });
    return { docs: docs, total: total, page: page, limit: limit };
  }

  async getOrders({
    page = 1,
    pageSize = 10,
    sort = { createdAt: 'asc' },
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      const docs = await this.OrderModel.find()
        .populate({
          path: 'item.product',
        })
        .skip(skip)
        .limit(limit)
        .sort(sort);
      const total = await this.OrderModel.count();
      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createOrder(user: UserDocument, createOrderDTO: CreateOrderDTO) {
    const cart = await this.cartService.findByCondition({ user: user._id });
    if (!cart) throw new Error('Cart is empty');
    let totalPrice = 0;
    for (const item of cart.item) {
      totalPrice += item.product.price * item.quantity;
    }

    let code = await this.getCode();
    const checkExist = this.OrderModel.findOne({ code: code });
    if (checkExist) {
      code = await this.getCode();
    }
    const orderObj = {
      user: user._id,
      item: cart.item,
      code: code,
      status: OrderStatusEnum.NEW,
      ...createOrderDTO,
      totalPrice: totalPrice,
    };

    const bulkWriteModel = [];
    for (const item of cart.item) {
      const productWarehouses =
        await this.productWarehouseService.findProductWarehouseByCondition({
          product: item.product,
        });
      const totalQuantityProductInWarehouse =
        await this.productWarehouseService.countQuantity();
      if (
        Number(item.quantity) >
        Number(totalQuantityProductInWarehouse['quantity'])
      )
        throw new BadRequestException();
      if (productWarehouses.length < 1) throw new BadRequestException();

      let itemQuantity = item.quantity;
      for (const productWarehouse of productWarehouses) {
        if (
          itemQuantity > productWarehouse.quantity ||
          itemQuantity === productWarehouse.quantity
        ) {
          {
            bulkWriteModel.push({
              updateOne: {
                filter: { _id: item.product },
                update: { $set: { quantity: 0 } },
              },
            });
          }

          if (itemQuantity < productWarehouse.quantity) {
            {
              bulkWriteModel.push({
                updateOne: {
                  filter: { _id: item.product },
                  update: {
                    $set: {
                      quantity: productWarehouse.quantity - itemQuantity,
                    },
                  },
                },
              });
            }

            if (itemQuantity === 0) break;
            itemQuantity = itemQuantity - productWarehouse.quantity;
          }
        }
      }
    }
    await this.productsService.bulkWrite(bulkWriteModel);
    await this.cartService.deleteByCondition({ user: user._id });
    return await (
      await this.OrderModel.create(orderObj)
    ).populate({
      path: 'item.product',
    });
  }

  async updateOrder(id: Types.ObjectId, updateOrderDTO: UpdateOrderDTO) {
    return await this.OrderModel.updateOne({ _id: id }, updateOrderDTO);
  }

  async getOrderById(id: Types.ObjectId) {
    return await this.OrderModel.findById(id).populate({
      path: 'item.product',
    });
  }

  async statistic({
    fromDate = '2023-2-14T11:16:12.815Z',
    toDate = '2023-12-28T11:16:12.815Z',
    formAtTime = 'date',
  }: GetQuery) {
    let docs: any;
    switch (formAtTime) {
      case 'date':
        docs = await this.statisticByDate(fromDate, toDate);
        break;
      case 'month':
        docs = await this.statisticByMonth(fromDate, toDate);
        break;
      case 'year':
        docs = await this.statisticByYear(fromDate, toDate);
        break;
    }
    return docs;
  }

  async statisticByDate(fromDate: string, toDate: string) {
    const pipelines = [
      {
        $match: {
          createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%d', date: '$createdAt' } },
          totalPrice: { $sum: '$totalPrice' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalPrice: 1,
        },
      },
    ];

    return await this.OrderModel.aggregate(pipelines);
  }

  async statisticByMonth(fromDate: string, toDate: string) {
    const pipelines = [
      {
        $match: {
          createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%m', date: '$createdAt' } },
          total_price: { $sum: '$totalPrice' },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          total_price: 1,
        },
      },
    ];

    return await this.OrderModel.aggregate(pipelines);
  }

  async statisticByYear(fromDate: string, toDate: string) {
    const pipelines = [
      {
        $match: {
          createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y', date: '$createdAt' } },
          total_price: { $sum: '$totalPrice' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id',
          total_price: 1,
        },
      },
    ];

    return await this.OrderModel.aggregate(pipelines);
  }

  async getCode() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    const formattedDate = format(currentDate, 'ddMMyy');
    const totalOrders = await this.OrderModel.count({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const code = 'HD' + totalOrders + formattedDate;
    return code;
  }
}
