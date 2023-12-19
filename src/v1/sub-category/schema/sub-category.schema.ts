import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Category } from 'src/v1/category/schema/category.schema';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Category.name,
  })
  category: Category;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
