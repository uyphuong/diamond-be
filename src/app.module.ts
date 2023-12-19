import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './v1/users/users.module';
import { AuthModule } from './core/auth/auth.module';
import { PostsModule } from './v1/post/post.module';
import { CommentModule } from './v1/comment/comment.module';
import { ProductsModule } from './v1/product/product.module';
import { CartModule } from './v1/cart/cart.module';
import { OrderModule } from './v1/order/order.module';
import { PromotionModule } from './v1/promotion/promotion.module';
import { CategoryModule } from './v1/category/category.module';
import { SubCategoryModule } from './v1/sub-category/sub-category.module';
import { WarehouseModule } from './v1/warehouse/warehouse.module';
import { ProductWarehouseModule } from './v1/product-warehouse/product-warehouse.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from './core/mail/mail.module';
import { RatingModule } from './v1/rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: `mongodb://${config.get('MONGO_USER')}:${config.get(
          'MONGO_PASSWORD',
        )}@${config.get('MONGO_HOST')}:${config.get('MONGO_PORT')}`,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/src/core/mail/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    CommentModule,
    ProductsModule,
    CartModule,
    OrderModule,
    PromotionModule,
    CategoryModule,
    SubCategoryModule,
    WarehouseModule,
    ProductWarehouseModule,
    MailModule,
    RatingModule,
  ],
})
export class AppModule {}
