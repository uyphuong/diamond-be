import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from 'src/v1/cart/schemas/cart.schema';
import { UpdateItemInCartDTO } from './dto/update-item-in-cart.dto';
import { UserDocument } from 'src/v1/users/schemas/user.schema';
import { Product } from 'src/v1/product/schemas/product.schema';
import { ProductsService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private CartModel: Model<CartDocument>,
    readonly productService: ProductsService,
  ) {}
  async getMe(user: UserDocument) {
    const cart = await this.CartModel.findOne({ user: user._id }).populate({
      path: 'item.product',
    });
    if (!cart) {
      await this.CartModel.create({ user: user._id });
      return await this.CartModel.findOne({ user: user._id }).populate({
        path: 'item.product',
      });
    }
    return cart;
  }

  async updateCart(
    user: UserDocument,
    updateItemInCartDTO: UpdateItemInCartDTO,
  ) {
    await this.CartModel.updateOne({ user: user._id }, updateItemInCartDTO);
    return await this.CartModel.findOne({ user: user._id }).populate({
      path: 'item.product',
    });
  }

  async updateItemInCart(
    user: UserDocument,
    updateItemInCartDTO: UpdateItemInCartDTO,
  ) {
    const cart = await this.CartModel.findOne({ user: user._id });
    if (!cart) {
      await this.CartModel.create({
        user: user._id,
        item: updateItemInCartDTO.item,
      });
      return await this.CartModel.findOne({ user: user._id }).populate({
        path: 'item.product',
      });
    }

    const itemInCart = cart.item;
    const itemInBody = updateItemInCartDTO.item;
    for (let i = 0; i < itemInBody.length; i++) {
      let checkExist = false;
      for (let j = 0; j < itemInCart.length; j++) {
        // if product of body exist in cart and quantity > 0 -> quantityCart += quantityBody
        if (
          String(itemInBody[i].product) === String(itemInCart[j].product) &&
          itemInBody[i].quantity > 0
        ) {
          const product = await this.productService.findByCondition({
            _id: itemInBody[i].product,
          });
          if (!product) throw new BadRequestException();

          itemInCart[j].quantity += itemInBody[i].quantity;
          checkExist = true;
          continue;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }

        // if product of body exist in cart and quantity = 0 -> remove product from cart
        if (
          String(itemInBody[i].product) === String(itemInCart[j].product) &&
          itemInBody[i].quantity == 0
        ) {
          checkExist = true;
          cart.item = cart.item.filter(
            (element) =>
              String(element.product) != String(itemInBody[i].product),
          );
          continue;
        }
      }

      // if product of body not exist in cart and quantity > 0 -> add product to cart
      if (!checkExist && itemInBody[i].quantity > 0) {
        const product = await this.productService.findByCondition({
          _id: itemInBody[i].product,
        });
        if (!product) throw new BadRequestException();
        cart.item.push({
          product: itemInBody[i].product as unknown as Product,
          quantity: itemInBody[i].quantity,
        });
      }
    }

    return await this.CartModel.findOneAndUpdate(
      { user: user._id },
      { item: cart.item },
      { new: true },
    ).populate({
      path: 'item.product',
    });
  }

  async findByCondition(condition: object) {
    return await this.CartModel.findOne(condition).populate({
      path: 'item.product',
    });
  }

  async deleteByCondition(condition: object) {
    return await this.CartModel.deleteOne(condition);
  }
}
