import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductWarehouse,
  ProductWarehouseSchema,
} from './schema/product-warehouse.schema';
import { ProductWarehouseService } from './product-warehouse.service';
import { ProductWarehouseController } from './product-warehouse.controller';
import { ProductsModule } from '../product/product.module';
import { WarehouseModule } from '../warehouse/warehouse.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductWarehouse.name,
        schema: ProductWarehouseSchema,
      },
    ]),
    forwardRef(() => ProductsModule),
    WarehouseModule,
  ],
  providers: [ProductWarehouseService],
  controllers: [ProductWarehouseController],
  exports: [ProductWarehouseService],
})
export class ProductWarehouseModule {}
