import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  type: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
