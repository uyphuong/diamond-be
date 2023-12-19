import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Product } from 'src/v1/product/schemas/product.schema';
import { Warehouse } from 'src/v1/warehouse/schema/warehouse.schema';

export type ProductWarehouseDocument = HydratedDocument<ProductWarehouse>;

@Schema({ timestamps: true })
export class ProductWarehouse {
  @Prop({
    type: Number,
    default: 0,
  })
  quantity: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Product.name,
  })
  product: Product;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Warehouse.name,
  })
  warehouse: Warehouse;
}

export const ProductWarehouseSchema =
  SchemaFactory.createForClass(ProductWarehouse);
