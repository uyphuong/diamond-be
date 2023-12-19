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
import { Types } from 'mongoose';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { UpsertWarehouseDTO } from './dto/upsert-warehouse.dto';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {}

  @Post('/')
  async createWarehouse(@Body() upsertWarehouseDTO: UpsertWarehouseDTO) {
    return await this.warehouseService.createWarehouse(upsertWarehouseDTO);
  }

  @Get('/')
  async getWarehouses(@Query() query: GetQuery) {
    return await this.warehouseService.getWarehouses(query);
  }

  @Get('/:id')
  async getWarehouse(@Param('id') id: Types.ObjectId) {
    return await this.warehouseService.getWarehouse(id);
  }

  @Put('/:id')
  async updateWarehouse(
    @Body() upsertWarehouseDTO: UpsertWarehouseDTO,
    @Param() { id }: { id: Types.ObjectId },
  ) {
    return await this.warehouseService.updateWarehouse(upsertWarehouseDTO, id);
  }

  @Delete('/:id')
  async deleteWarehouse(@Param() { id }: { id: Types.ObjectId }) {
    return await this.warehouseService.deleteWarehouse(id);
  }
}
