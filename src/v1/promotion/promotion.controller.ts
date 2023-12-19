import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { Types } from 'mongoose';
import { WithActiveTokenOnly } from 'src/core/auth/decorators/token-meta.decoratios';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { UpsertPromotionDTO } from './dto/upsert-promotion.dto';
import { HasRoles } from 'src/core/auth/interfaces/has-role.decorator';
import { RoleUserEnum } from 'src/core/auth/interfaces/role.enum';

@Controller('promotion')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @WithActiveTokenOnly()
  @HasRoles(RoleUserEnum.admin)
  @Post('/')
  async createComment(@Body() createBooking: UpsertPromotionDTO) {
    return await this.promotionService.createPromotion(createBooking);
  }

  @Get('/')
  async getPromotions(@Query() query: GetQuery) {
    return await this.promotionService.getPromotions(query);
  }

  @Get('/:id')
  async getPromotion(@Param('id') id: Types.ObjectId) {
    return await this.promotionService.getPromotion(id);
  }

  @WithActiveTokenOnly()
  @HasRoles(RoleUserEnum.admin)
  @Put('/:id')
  async updatePromotion(
    @Body() updateBookingDTO: UpsertPromotionDTO,
    @Param() { id }: { id: Types.ObjectId },
  ) {
    return await this.promotionService.updatePromotion(updateBookingDTO, id);
  }

  @HasRoles(RoleUserEnum.admin)
  @WithActiveTokenOnly()
  @Delete('/:id')
  async deletePromotion(@Param() { id }: { id: Types.ObjectId }) {
    return await this.promotionService.deletePromotion(id);
  }
}
