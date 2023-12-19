import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from 'src/v1/post/schemas/post.schema';
import { UpsertPostDTO } from './dto/upsert-post.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { GetQuery } from 'src/utils/get-query.interfaces';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(createPostDTO: UpsertPostDTO, user: UserDocument) {
    try {
      const payload = { ...createPostDTO, ...{ user: user._id } };
      return await this.postModel.create(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getPosts({
    page = 1,
    pageSize = 10,
    sort = { createdAt: -1 },
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      const docs = await this.postModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort(sort);
      const total = await this.postModel.count();
      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getPost(id: Types.ObjectId) {
    try {
      const res = await this.postModel.findById(id);
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updatePost(updatePostDTO: UpsertPostDTO, id: Types.ObjectId) {
    try {
      return await this.postModel
        .findByIdAndUpdate(id, updatePostDTO, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletePost(id: Types.ObjectId) {
    try {
      return await this.postModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
