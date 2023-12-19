import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UpsertPostDTO } from './dto/upsert-post.dto';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/core/auth/guards/auth.guard';
import { WithActiveTokenOnly } from 'src/core/auth/decorators/token-meta.decoratios';
import { HasRoles } from 'src/core/auth/interfaces/has-role.decorator';
import { RoleUserEnum } from 'src/core/auth/interfaces/role.enum';
import { RequestExpress } from 'src/core/auth/interfaces/exception-response.interface';
import { GetQuery } from 'src/utils/get-query.interfaces';

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @WithActiveTokenOnly()
  @HasRoles(RoleUserEnum.user)
  @Post('/')
  async createPost(
    @Body() createPostDTO: UpsertPostDTO,
    @Request() req: RequestExpress,
  ) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.postService.createPost(createPostDTO, user);
  }

  @Get('/')
  async getPosts(@Query() query: GetQuery) {
    return await this.postService.getPosts(query);
  }
  @Get('/:id')
  async getPost(@Param('id') id: Types.ObjectId) {
    return await this.postService.getPost(id);
  }

  @WithActiveTokenOnly()
  @HasRoles(RoleUserEnum.user)
  @Put('/:id')
  async updatePost(
    @Body() updatePostDTO: UpsertPostDTO,
    @Param() { id }: { id: Types.ObjectId },
  ) {
    return await this.postService.updatePost(updatePostDTO, id);
  }

  @WithActiveTokenOnly()
  @HasRoles(RoleUserEnum.user)
  @Delete('/:id')
  async deletePost(@Param() { id }: { id: Types.ObjectId }) {
    return await this.postService.deletePost(id);
  }
}
