import {
  Controller,
  Get,
  Body,
  UseGuards,
  Request,
  Post,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/core/auth/guards/auth.guard';
import { WithActiveTokenOnly } from 'src/core/auth/decorators/token-meta.decoratios';
import { RequestExpress } from 'src/core/auth/interfaces/exception-response.interface';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { Types } from 'mongoose';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { CreateOrderDTO } from './dto/create-order.dto';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private OrderServices: OrderService) {}

  @WithActiveTokenOnly()
  @Get('/me')
  async getMe(@Request() req: RequestExpress, @Query() query: GetQuery) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.OrderServices.getMe(user, query);
  }

  @WithActiveTokenOnly()
  @Get('')
  async getOrders(@Query() query: GetQuery) {
    return await this.OrderServices.getOrders(query);
  }

  @WithActiveTokenOnly()
  @Get('/statistic')
  async statistic(@Request() req: RequestExpress, @Query() query: GetQuery) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.OrderServices.statistic(query);
  }

  @WithActiveTokenOnly()
  @Get(':id')
  async getOrderById(@Param('id') id: Types.ObjectId) {
    return await this.OrderServices.getOrderById(id);
  }

  @WithActiveTokenOnly()
  @Post('/')
  async createOrder(
    @Request() req: RequestExpress,
    @Body() createOrderDTO: CreateOrderDTO,
  ) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.OrderServices.createOrder(user, createOrderDTO);
  }

  @WithActiveTokenOnly()
  @Patch('/:id')
  async updateOrder(
    @Request() req: RequestExpress,
    @Body() updateOrderDTO: UpdateOrderDTO,
    @Param('id') id: Types.ObjectId,
  ) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.OrderServices.updateOrder(id, updateOrderDTO);
  }
}
