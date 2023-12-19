import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { SubCategory, SubCategoryDocument } from './schema/sub-category.schema';
import { UpsertSubCategoryDTO } from './dto/upsert-sub-category.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<SubCategoryDocument>,
  ) {}

  async createSubCategory(upsertSubCategoryDTO: UpsertSubCategoryDTO) {
    try {
      return await this.subCategoryModel.create(upsertSubCategoryDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getSubCategories({
    page = 1,
    pageSize = 10,
    sort = { createdAt: -1 },
    category = undefined,
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      if (category) {
        const total = await this.subCategoryModel.count({ category: category });
        const docs = await this.subCategoryModel
          .find({ category: category })
          .skip(skip)
          .limit(limit)
          .sort(sort)
          .populate({ path: 'category' });
        return { docs: docs, total: total, page: page, limit: limit };
      }

      const docs = await this.subCategoryModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate({ path: 'category' });
      const total = await this.subCategoryModel.count();
      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async groupCategory() {
    const pipeline = [
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      {
        $unwind: '$categoryInfo',
      },
      {
        $group: {
          _id: '$categoryInfo',
          subcategories: {
            $push: {
              _id: '$_id',
              name: '$name',
              createdAt: '$createdAt',
            },
          },
        },
      },
    ];

    return await this.subCategoryModel
      .aggregate(pipeline)
      .sort({ createdAt: -1 });
  }

  async getSubCategory(id: Types.ObjectId) {
    try {
      return await this.subCategoryModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateSubCategory(
    upsertSubCategoryDTO: UpsertSubCategoryDTO,
    id: Types.ObjectId,
  ) {
    try {
      return await this.subCategoryModel
        .findByIdAndUpdate(id, upsertSubCategoryDTO, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteSubCategory(id: Types.ObjectId) {
    try {
      return await this.subCategoryModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getSubCategoriesByCondition(condition: object) {
    try {
      return await this.subCategoryModel.find(condition);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
