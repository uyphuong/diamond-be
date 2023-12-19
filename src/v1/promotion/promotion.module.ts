import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Promotion,
  PromotionSchema,
} from 'src/v1/promotion/schemas/promotion.schema';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
    ]),
  ],
  providers: [PromotionService],
  controllers: [PromotionController],
})
export class PromotionModule {}
