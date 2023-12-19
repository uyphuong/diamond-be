import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { Warehouse, WarehouseDocument } from './schema/warehouse.schema';
import { UpsertWarehouseDTO } from './dto/upsert-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectModel(Warehouse.name)
    private warehouseModel: Model<WarehouseDocument>,
  ) {}

  async createWarehouse(upsertWarehouseDTO: UpsertWarehouseDTO) {
    try {
      return await this.warehouseModel.create(upsertWarehouseDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getWarehouses({
    page = 1,
    pageSize = 10,
    sort = { createdAt: -1 },
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;

      const docs = await this.warehouseModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort(sort);
      const total = await this.warehouseModel.count();
      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getWarehouse(id: Types.ObjectId) {
    try {
      return await this.warehouseModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateWarehouse(
    upsertWarehouseDTO: UpsertWarehouseDTO,
    id: Types.ObjectId,
  ) {
    try {
      return await this.warehouseModel
        .findByIdAndUpdate(id, upsertWarehouseDTO, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteWarehouse(id: Types.ObjectId) {
    try {
      return await this.warehouseModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getSubCategoriesByCondition(condition: object) {
    try {
      return await this.warehouseModel.find(condition);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
