import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { Category, CategoryDocument } from './schema/category.schema';
import { UpsertCategoryDTO } from './dto/upsert_category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory(upsertCategoryDTO: UpsertCategoryDTO) {
    try {
      return await this.categoryModel.create(upsertCategoryDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getCategories({
    page = 1,
    pageSize = 10,
    sort = { createdAt: -1 },
    type = undefined,
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      let docs = [];
      let total = 0;
      if (type) {
        docs = await this.categoryModel
          .find({ type: type })
          .skip(skip)
          .limit(limit)
          .sort(sort);
        total = await this.categoryModel.count({ type: type });
      } else {
        docs = await this.categoryModel
          .find()
          .skip(skip)
          .limit(limit)
          .sort(sort);
        total = await this.categoryModel.count();
      }

      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getCategory(id: Types.ObjectId) {
    try {
      return await this.categoryModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateCategory(
    upsertCategoryDTO: UpsertCategoryDTO,
    id: Types.ObjectId,
  ) {
    try {
      return await this.categoryModel
        .findByIdAndUpdate(id, upsertCategoryDTO, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteCategory(id: Types.ObjectId) {
    try {
      return await this.categoryModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
