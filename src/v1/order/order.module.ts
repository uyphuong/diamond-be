import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/v1/order/schemas/order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthModule } from 'src/core/auth/auth.module';
import { ProductsModule } from '../product/product.module';
import { CartModule } from '../cart/cart.module';
import { ProductWarehouseModule } from '../product-warehouse/product-warehouse.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    forwardRef(() => AuthModule),
    ProductsModule,
    CartModule,
    ProductWarehouseModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
