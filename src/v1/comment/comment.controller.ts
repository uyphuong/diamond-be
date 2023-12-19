import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { Types } from 'mongoose';
import { WithActiveTokenOnly } from 'src/core/auth/decorators/token-meta.decoratios';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { RequestExpress } from 'src/core/auth/interfaces/exception-response.interface';
import { HasRoles } from 'src/core/auth/interfaces/has-role.decorator';
import { RoleUserEnum } from 'src/core/auth/interfaces/role.enum';
import { AuthGuard } from 'src/core/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @WithActiveTokenOnly()
  @HasRoles(RoleUserEnum.user)
  @Post('/')
  async createComment(
    @Body() createComment: CreateCommentDTO,
    @Request() req: RequestExpress,
  ) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.commentService.createComment(createComment, user);
  }

  @Get('/')
  async getComments(@Query() query: GetQuery) {
    return await this.commentService.getComments(query);
  }

  @Get('/:id')
  async getComment(@Param('id') id: Types.ObjectId) {
    return await this.commentService.getComment(id);
  }

  @WithActiveTokenOnly()
  @Put('/:id')
  async updateComment(
    @Body() updateBookingDTO: UpdateCommentDTO,
    @Param() { id }: { id: Types.ObjectId },
  ) {
    return await this.commentService.updateComment(updateBookingDTO, id);
  }

  @WithActiveTokenOnly()
  @Delete('/:id')
  async deleteComment(@Param() { id }: { id: Types.ObjectId }) {
    return await this.commentService.deleteComment(id);
  }
}
