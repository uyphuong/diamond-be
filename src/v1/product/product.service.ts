import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from 'src/v1/product/schemas/product.schema';
import { UpsertProductDTO } from './dto/upsert-product.dto';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { ShareFunction } from 'src/utils/share-function';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { ProductWarehouseService } from '../product-warehouse/product-warehouse.service';
import { RatingService } from '../rating/rating.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    readonly subCategoryService: SubCategoryService,
    @Inject(forwardRef(() => ProductWarehouseService))
    readonly productWarehouseService: ProductWarehouseService,
    readonly ratingService: RatingService,
  ) {}

  async createProduct(UpsertProductDTO: UpsertProductDTO) {
    try {
      const searchString =
        UpsertProductDTO.name +
        ' ' +
        UpsertProductDTO.material +
        ' ' +
        UpsertProductDTO.gender;
      const searchStringConvert =
        ShareFunction.nonAccentVietnamese(searchString);
      const payload = {
        ...UpsertProductDTO,
        ...{ searchString: searchStringConvert },
      };

      return await this.productModel.create(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProducts({
    page = 1,
    pageSize = 10,
    sort = { createdAt: -1 },
    trending = undefined,
    subCategory = undefined,
    category = undefined,
    size = undefined,
    search = undefined,
    fromPrice = undefined,
    toPrice = undefined,
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      let docs = [];
      let total = 0;
      let condition = {};
      if (trending) {
        condition = { ...condition, ...{ isTrending: trending } };
      }

      if (search) {
        const searchStringConvert = ShareFunction.nonAccentVietnamese(search);

        condition = {
          ...condition,
          ...{ searchString: { $regex: `.*${searchStringConvert}.*` } },
        };
      }

      if (fromPrice && toPrice) {
        condition = {
          ...condition,
          ...{ price: { $gte: fromPrice, $lte: toPrice } },
        };
      }

      if (size) {
        condition = { ...condition, ...{ size: size } };
      }

      if (subCategory) {
        condition = { ...condition, ...{ subCategory: subCategory } };
      }

      if (category) {
        const subCategories =
          await this.subCategoryService.getSubCategoriesByCondition({
            category: category,
          });
        if (subCategories.length === 0) {
          return;
        }

        const subCategoryIDs = [];
        for (const subCategory of subCategories) {
          subCategoryIDs.push(subCategory._id);
        }

        condition = {
          ...condition,
          ...{ subCategory: { $in: subCategoryIDs } },
        };
      }

      docs = await this.productModel
        .find(condition)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate({
          path: 'subCategory',
          populate: { path: 'category' },
        });
      total = await this.productModel.count(condition);
      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProduct(id: Types.ObjectId): Promise<any> {
    try {
      const productWarehouses =
        await this.productWarehouseService.findProductWarehouseByCondition({
          product: id,
        });

      let totalProduct = 0;
      for (const productWarehouse of productWarehouses) {
        totalProduct += productWarehouse.quantity;
      }

      const ratings = await this.ratingService.getRatingsByCondition({
        product: id,
      });
      const totalRatings = await this.ratingService.countRatingsByCondition({
        product: id,
      });

      let totalRate = 0;
      if (ratings.length > 0) {
        for (const rating of ratings) {
          totalRate += rating.rate;
        }
      }
      const averageRate = (totalRate / totalRatings).toFixed(1);

      const doc = await this.productModel.findOne({ _id: id }).populate({
        path: 'subCategory',
        populate: { path: 'category' },
      });

      return { ...doc?.['_doc'], quantity: totalProduct, rate: averageRate };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateProduct(upsertProductDTO: UpsertProductDTO, id: Types.ObjectId) {
    try {
      const searchString =
        upsertProductDTO.name +
        ' ' +
        upsertProductDTO.material +
        ' ' +
        upsertProductDTO.gender;
      const searchStringConvert =
        ShareFunction.nonAccentVietnamese(searchString);
      const payload = {
        ...upsertProductDTO,
        ...{ searchString: searchStringConvert },
      };
      return await this.productModel
        .findByIdAndUpdate(id, payload, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteProduct(id: Types.ObjectId) {
    try {
      return await this.productModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findByCondition(condition: object): Promise<Product> {
    return await this.productModel.findOne(condition);
  }

  async bulkWrite(bulkWriteModel: any) {
    return await this.productModel.bulkWrite(bulkWriteModel);
  }
}
