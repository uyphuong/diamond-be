import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetQuery } from 'src/utils/get-query.interfaces';
import {
  ProductWarehouse,
  ProductWarehouseDocument,
} from './schema/product-warehouse.schema';
import { UpsertProductWarehouseDTO } from './dto/upsert-product-warehouse.dto';

@Injectable()
export class ProductWarehouseService {
  constructor(
    @InjectModel(ProductWarehouse.name)
    private productWarehouseModel: Model<ProductWarehouseDocument>,
  ) {}

  async createProductWarehouse(
    upsertProductWarehouseDTO: UpsertProductWarehouseDTO,
  ) {
    try {
      return await this.productWarehouseModel.findOneAndUpdate(
        {
          warehouse: upsertProductWarehouseDTO.warehouse,
          product: upsertProductWarehouseDTO.product,
        },
        upsertProductWarehouseDTO,
        { new: true, upsert: true },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProductWarehouses({
    page = 1,
    pageSize = 10,
    sort = { createdAt: -1 },
    product = undefined,
    warehouse = undefined,
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;

      if (product) {
        const docs = await this.productWarehouseModel
          .find({ product: product })
          .skip(skip)
          .limit(limit)
          .sort(sort)
          .populate([{ path: 'warehouse' }, { path: 'product' }]);
        const total = await this.productWarehouseModel.count({
          product: product,
        });
        return { docs: docs, total: total, page: page, limit: limit };
      }

      if (warehouse) {
        const docs = await this.productWarehouseModel
          .find({ warehouse: warehouse })
          .skip(skip)
          .limit(limit)
          .sort(sort)
          .populate([{ path: 'warehouse' }, { path: 'product' }]);
        const total = await this.productWarehouseModel.count({
          warehouse: warehouse,
        });
        return { docs: docs, total: total, page: page, limit: limit };
      }

      const docs = await this.productWarehouseModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate([{ path: 'warehouse' }, { path: 'product' }]);
      const total = await this.productWarehouseModel.count();
      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProductWarehouse(
    upsertProductWarehouseDTO: UpsertProductWarehouseDTO,
  ) {
    try {
      return await this.productWarehouseModel
        .find({
          product: upsertProductWarehouseDTO.product,
          warehouse: upsertProductWarehouseDTO.warehouse,
        })
        .populate([{ path: 'warehouse' }, { path: 'product' }]);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateProductWarehouse(
    upsertProductWarehouseDTO: UpsertProductWarehouseDTO,
  ) {
    try {
      return await this.productWarehouseModel
        .findOneAndUpdate(
          {
            warehouse: upsertProductWarehouseDTO.warehouse,
            product: upsertProductWarehouseDTO.product,
          },
          upsertProductWarehouseDTO,
          { new: true, upsert: true },
        )
        .populate([{ path: 'warehouse' }, { path: 'product' }])
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteProductWarehouse(
    upsertProductWarehouseDTO: UpsertProductWarehouseDTO,
  ) {
    try {
      return await this.productWarehouseModel.deleteOne({
        product: upsertProductWarehouseDTO.product,
        warehouse: upsertProductWarehouseDTO.warehouse,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findProductWarehouseByCondition(condition: object) {
    try {
      return await this.productWarehouseModel.find(condition);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async countQuantity() {
    try {
      return await this.productWarehouseModel.aggregate([
        {
          $group: { _id: null, count: { $sum: '$quantity' } },
        },
      ]);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
