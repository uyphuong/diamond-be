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
import { SubCategoryService } from './sub-category.service';
import { Types } from 'mongoose';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { UpsertSubCategoryDTO } from './dto/upsert-sub-category.dto';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @Post('/')
  async createSubCategory(@Body() upsertSubCategoryDTO: UpsertSubCategoryDTO) {
    return await this.subCategoryService.createSubCategory(
      upsertSubCategoryDTO,
    );
  }

  @Get('/')
  async getSubCategories(@Query() query: GetQuery) {
    return await this.subCategoryService.getSubCategories(query);
  }

  @Get('/group-category')
  async groupCategory() {
    return await this.subCategoryService.groupCategory();
  }

  @Get('/:id')
  async getSubCategory(@Param('id') id: Types.ObjectId) {
    return await this.subCategoryService.getSubCategory(id);
  }

  @Put('/:id')
  async updateSubCategory(
    @Body() upsertSubCategoryDTO: UpsertSubCategoryDTO,
    @Param() { id }: { id: Types.ObjectId },
  ) {
    return await this.subCategoryService.updateSubCategory(
      upsertSubCategoryDTO,
      id,
    );
  }

  @Delete('/:id')
  async deleteSubCategory(@Param() { id }: { id: Types.ObjectId }) {
    return await this.subCategoryService.deleteSubCategory(id);
  }
}
