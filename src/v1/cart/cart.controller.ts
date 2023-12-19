import {
  Controller,
  Get,
  Body,
  UseGuards,
  Request,
  Patch,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateItemInCartDTO } from './dto/update-item-in-cart.dto';
import { AuthGuard } from 'src/core/auth/guards/auth.guard';
import { WithActiveTokenOnly } from 'src/core/auth/decorators/token-meta.decoratios';
import { RequestExpress } from 'src/core/auth/interfaces/exception-response.interface';
import { RoleUserEnum } from 'src/core/auth/interfaces/role.enum';
import { HasRoles } from 'src/core/auth/interfaces/has-role.decorator';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartServices: CartService) {}

  @WithActiveTokenOnly()
  @HasRoles(RoleUserEnum.user)
  @Get('/me')
  async getMe(@Request() req: RequestExpress) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.cartServices.getMe(user);
  }

  @WithActiveTokenOnly()
  @HasRoles(RoleUserEnum.user)
  @Put('/')
  async updateCart(
    @Request() req: RequestExpress,
    @Body() updateItemInCartDTO: UpdateItemInCartDTO,
  ) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.cartServices.updateCart(user, updateItemInCartDTO);
  }

  @WithActiveTokenOnly()
  @HasRoles(RoleUserEnum.user)
  @Patch('/update-item')
  async updateItemInCart(
    @Request() req: RequestExpress,
    @Body() updateItemInCartDTO: UpdateItemInCartDTO,
  ) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.cartServices.updateItemInCart(user, updateItemInCartDTO);
  }
}
