import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Comment,
  CommentDocument,
} from 'src/v1/comment/schemas/comment.schema';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createComment(createComment: CreateCommentDTO, user: UserDocument) {
    try {
      const payload = { ...createComment, ...{ user: user._id } };
      return await this.commentModel.create(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getComments({
    page = 1,
    pageSize = 10,
    sort = { createdAt: -1 },
    product = undefined,
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;

      if (product) {
        const docs = await this.commentModel
          .find({ product: product })
          .skip(skip)
          .limit(limit)
          .sort(sort)
          .populate({
            path: 'user',
            select: '-password',
          });
        const total = await this.commentModel.count({ product: product });
        return { docs: docs, total: total, page: page, limit: limit };
      }

      const docs = await this.commentModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate({
          path: 'user',
          select: '-password',
        });
      const total = await this.commentModel.count();
      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getComment(id: Types.ObjectId) {
    try {
      return await this.commentModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateComment(updateCommentDTO: UpdateCommentDTO, id: Types.ObjectId) {
    try {
      return await this.commentModel
        .findByIdAndUpdate(id, updateCommentDTO, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteComment(id: Types.ObjectId) {
    try {
      return await this.commentModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
