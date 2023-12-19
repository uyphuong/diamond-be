import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Product } from 'src/v1/product/schemas/product.schema';
import { User } from 'src/v1/users/schemas/user.schema';

export type RatingDocument = HydratedDocument<Rating>;

@Schema({ timestamps: true })
export class Rating {
  @Prop({
    type: Number,
  })
  rate: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Product.name,
  })
  product: Product;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
