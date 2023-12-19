import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Product } from 'src/v1/product/schemas/product.schema';
import { User } from 'src/v1/users/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({
    type: String,
  })
  content: string;

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

export const PostSchema = SchemaFactory.createForClass(Post);
