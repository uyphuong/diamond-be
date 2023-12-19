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
import { ProductsService } from './product.service';
import { UpsertProductDTO } from './dto/upsert-product.dto';
import { Types } from 'mongoose';
import { WithActiveTokenOnly } from 'src/core/auth/decorators/token-meta.decoratios';
import { GetQuery } from 'src/utils/get-query.interfaces';

@Controller('product')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post('/')
  async createProduct(@Body() createProduct: UpsertProductDTO) {
    return await this.productService.createProduct(createProduct);
  }

  @Get('/')
  async getProducts(@Query() query: GetQuery) {
    return await this.productService.getProducts(query);
  }

  @Get('/:id')
  async getProduct(@Param('id') id: Types.ObjectId) {
    return await this.productService.getProduct(id);
  }

  @WithActiveTokenOnly()
  @Put('/:id')
  async updateProduct(
    @Body() updateProductDTO: UpsertProductDTO,
    @Param() { id }: { id: Types.ObjectId },
  ) {
    return await this.productService.updateProduct(updateProductDTO, id);
  }

  @WithActiveTokenOnly()
  @Delete('/:id')
  async deleteProduct(@Param() { id }: { id: Types.ObjectId }) {
    return await this.productService.deleteProduct(id);
  }
}
