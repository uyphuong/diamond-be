import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Promotion,
  PromotionDocument,
} from 'src/v1/promotion/schemas/promotion.schema';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { UpsertPromotionDTO } from './dto/upsert-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name)
    private promotionModel: Model<PromotionDocument>,
  ) {}

  async createPromotion(upsertPostDTO: UpsertPromotionDTO) {
    try {
      return await this.promotionModel.create(upsertPostDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getPromotions({
    page = 1,
    pageSize = 10,
    sort = { createdAt: -1 },
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      const docs = await this.promotionModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort(sort);
      const total = await this.promotionModel
        .count()
        .skip(skip)
        .limit(limit)
        .sort(sort);

      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getPromotion(id: Types.ObjectId) {
    try {
      return await this.promotionModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updatePromotion(
    upsertPromotionDTO: UpsertPromotionDTO,
    id: Types.ObjectId,
  ) {
    try {
      return await this.promotionModel
        .findByIdAndUpdate(id, upsertPromotionDTO, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletePromotion(id: Types.ObjectId) {
    try {
      return await this.promotionModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
