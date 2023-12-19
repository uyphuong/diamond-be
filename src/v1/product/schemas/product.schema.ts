import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { SubCategory } from 'src/v1/sub-category/schema/sub-category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: String,
  })
  searchString: string;

  @Prop({
    type: String,
  })
  material: string;

  @Prop({
    type: Number,
  })
  size: number;

  @Prop({
    type: String,
  })
  gender: string;

  @Prop({
    type: Number,
  })
  promotion: number;

  @Prop({
    type: [String],
    default: [],
  })
  image: [string];

  @Prop({
    type: Number,
  })
  price: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  isTrending: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: SubCategory.name,
  })
  subCategory: SubCategory;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
