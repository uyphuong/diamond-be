import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/v1/users/schemas/user.schema';
import { RegisterDTO } from 'src/core/auth/interfaces/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/core/auth/interfaces/login.dto';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserById(id: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createOneUser(registerDTO: RegisterDTO) {
    try {
      const { password, ...rest } = registerDTO;
      const checkExistUser = await this.userModel.findOne({
        username: registerDTO.username,
      });
      if (checkExistUser) {
        throw new Error('User Already Exist');
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const data = { password: hashedPassword, ...rest };
      const user = await this.userModel.create(data);
      const { password: userPassowrd, ...userWithoutPassword } = user['_doc'];
      return userWithoutPassword;
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new ConflictException(JSON.stringify(error.keyValue));
      }
      throw new BadRequestException(error);
    }
  }

  async findAndVerify(loginDTO: LoginDTO) {
    try {
      const { username, password } = loginDTO;

      const user = await this.userModel.findOne({ username });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      const compare = await bcrypt.compare(password, user.password);

      if (!compare) {
        throw new BadRequestException('Password is not correct');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateMe(user: any, updateUserDTO: UpdateUserDTO) {
    try {
      if (updateUserDTO.password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(updateUserDTO.password, salt);
        updateUserDTO.password = hashedPassword;
      }
      return await this.userModel.findByIdAndUpdate(user?._id, updateUserDTO, {
        new: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getUsers({
    page = 1,
    pageSize = 10,
    sort = { createdAt: -1 },
  }: GetQuery) {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;

      const docs = await this.userModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort(sort);
      const total = await this.userModel.count();
      return { docs: docs, total: total, page: page, limit: limit };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getUserByCondition(condition: object) {
    try {
      return await this.userModel.findOne(condition);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateUserByCondition(condition: object, data: object) {
    try {
      return await this.userModel.updateOne(condition, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
