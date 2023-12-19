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
import { CategoryService } from './category.service';
import { Types } from 'mongoose';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { UpsertCategoryDTO } from './dto/upsert_category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/')
  async createCategory(@Body() upsertCategoryDTO: UpsertCategoryDTO) {
    return await this.categoryService.createCategory(upsertCategoryDTO);
  }

  @Get('/')
  async getCategories(@Query() query: GetQuery) {
    return await this.categoryService.getCategories(query);
  }

  @Get('/:id')
  async getCategory(@Param('id') id: Types.ObjectId) {
    return await this.categoryService.getCategory(id);
  }

  @Put('/:id')
  async updateCategory(
    @Body() upsertCategoryDTO: UpsertCategoryDTO,
    @Param() { id }: { id: Types.ObjectId },
  ) {
    return await this.categoryService.updateCategory(upsertCategoryDTO, id);
  }

  @Delete('/:id')
  async deleteCategory(@Param() { id }: { id: Types.ObjectId }) {
    return await this.categoryService.deleteCategory(id);
  }
}
