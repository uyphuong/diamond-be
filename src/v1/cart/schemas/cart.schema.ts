import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../product/schemas/product.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop({
    _id: false,
    id: false,
    type: [
      {
        product: {
          type: MongooseSchema.Types.ObjectId,
          ref: Product.name,
        },
        quantity: { type: Number },
      },
    ],

    customPopulate: 'item.product',
    default: [],
  })
  item: {
    product: Product;
    quantity: number;
  }[] = [];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
