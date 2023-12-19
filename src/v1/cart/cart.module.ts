import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/v1/cart/schemas/cart.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductsModule } from '../product/product.module';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    forwardRef(() => AuthModule),
    ProductsModule,
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartModule, CartService],
})
export class CartModule {}
