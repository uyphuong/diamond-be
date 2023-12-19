import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { WithActiveTokenOnly } from 'src/core/auth/decorators/token-meta.decoratios';
import { AuthGuard } from 'src/core/auth/guards/auth.guard';
import { IAttachedUserRequest } from 'src/core/auth/interfaces/IAttachedUserRequest';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { UsersService } from './users.service';
import { HasRoles } from 'src/core/auth/interfaces/has-role.decorator';
import { RoleUserEnum } from 'src/core/auth/interfaces/role.enum';
import { UpdateUserDTO } from './dto/update-user.dto';
import { RequestExpress } from 'src/core/auth/interfaces/exception-response.interface';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  @WithActiveTokenOnly()
  async myInfor(@Req() req: IAttachedUserRequest) {
    const { user } = req;
    delete user.password;
    return {
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      email: user.email,
    };
  }

  // @WithActiveTokenOnly()
  // @HasRoles(RoleUserEnum.admin)
  @Get('/')
  async getUsers(@Query() query: GetQuery) {
    return await this.userService.getUsers(query);
  }

  @WithActiveTokenOnly()
  @Put('/me')
  async updateMe(
    @Body() updateUserDTO: UpdateUserDTO,
    @Request() req: RequestExpress,
  ) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.userService.updateMe(user, updateUserDTO);
  }
}
