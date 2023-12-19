import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { Rating, RatingDocument } from './schema/rating.schema';
import { UpsertRatingDTO } from './dto/upsert-rating.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name)
    private ratingModel: Model<RatingDocument>,
  ) {}

  async createRating(upsertRatingDTO: UpsertRatingDTO, user: User) {
    try {
      const payload = { ...upsertRatingDTO, ...{ user: user['_id'] } };
      return await this.ratingModel.create(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getRatings({
    page = 1,
    pageSize = 10,
    sort = { createdAt: -1 },
    product = undefined,
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;

      if (product) {
        const docs = await this.ratingModel
          .find({ product: product })
          .skip(skip)
          .limit(limit)
          .sort(sort)
          .populate({ path: 'product' });
        const total = await this.ratingModel.count({ product: product });
        return { docs: docs, total: total, page: page, limit: limit };
      }

      const docs = await this.ratingModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate({ path: 'product' });
      const total = await this.ratingModel.count();
      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getRating(id: Types.ObjectId) {
    try {
      return await this.ratingModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateRating(upsertRatingDTO: UpsertRatingDTO, id: Types.ObjectId) {
    try {
      return await this.ratingModel
        .findByIdAndUpdate(id, upsertRatingDTO, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteRating(id: Types.ObjectId) {
    try {
      return await this.ratingModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getRatingsByCondition(conditon: object) {
    try {
      return await this.ratingModel.find(conditon);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async countRatingsByCondition(conditon: object) {
    try {
      return await this.ratingModel.count(conditon);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
