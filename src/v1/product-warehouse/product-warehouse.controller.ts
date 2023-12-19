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
import { GetQuery } from 'src/utils/get-query.interfaces';
import { UpsertProductWarehouseDTO } from './dto/upsert-product-warehouse.dto';
import { ProductWarehouseService } from './product-warehouse.service';
import { Types } from 'mongoose';

@Controller('product-warehouse')
export class ProductWarehouseController {
  constructor(private productWarehouseService: ProductWarehouseService) {}

  @Post('/')
  async createProductWarehouse(
    @Body() upsertProductWarehouseDTO: UpsertProductWarehouseDTO,
  ) {
    return await this.productWarehouseService.createProductWarehouse(
      upsertProductWarehouseDTO,
    );
  }

  @Get('/')
  async getProductWarehouses(@Query() query: GetQuery) {
    return await this.productWarehouseService.getProductWarehouses(query);
  }

  @Get('/one')
  async getProductWarehouse(
    @Body() upsertProductWarehouseDTO: UpsertProductWarehouseDTO,
  ) {
    return await this.productWarehouseService.getProductWarehouse(
      upsertProductWarehouseDTO,
    );
  }

  @Put('/')
  async updateProductWarehouse(
    @Body() upsertProductWarehouseDTO: UpsertProductWarehouseDTO,
  ) {
    return await this.productWarehouseService.updateProductWarehouse(
      upsertProductWarehouseDTO,
    );
  }

  @Delete('/')
  async deleteProductWarehouse(
    @Body() upsertProductWarehouseDTO: UpsertProductWarehouseDTO,
  ) {
    return await this.productWarehouseService.deleteProductWarehouse(
      upsertProductWarehouseDTO,
    );
  }
}
