import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { Product, ProductSchema } from 'src/v1/product/schemas/product.schema';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { ProductWarehouseModule } from '../product-warehouse/product-warehouse.module';
import { RatingModule } from '../rating/rating.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    SubCategoryModule,
    forwardRef(() => ProductWarehouseModule),
    forwardRef(() => RatingModule),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
