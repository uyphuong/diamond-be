import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../product/schemas/product.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
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
        price: { type: Number },
      },
    ],

    default: [],
  })
  item: {
    product: Product;
    quantity: number;
    price: number;
  }[] = [];

  @Prop({
    type: String,
  })
  status: string;

  @Prop({
    type: Number,
    default: 0,
  })
  totalPrice: number;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
    unique: true,
  })
  code: string;

  @Prop({
    type: String,
  })
  address: string;

  @Prop({
    type: String,
  })
  phone: string;

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  note: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
