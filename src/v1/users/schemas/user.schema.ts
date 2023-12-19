import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleUserEnum } from 'src/core/auth/interfaces/role.enum';

export type UserDocument = HydratedDocument<User>;

const noWhitespaceValidator = (value: string) => {
  return !/\s/.test(value); // Kiểm tra xem có khoảng trắng không
};

@Schema({ timestamps: true })
export class User {
  @Prop({
    length: [5, 26],
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [noWhitespaceValidator, 'Username cannot contain whitespace'],
  })
  username: string;

  @Prop({
    required: true,
    trim: true,
    validate: [noWhitespaceValidator, 'Password cannot contain whitespace'],
  })
  password: string;

  @Prop({
    type: String,
  })
  fullName: string;

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  birthday: string;

  @Prop({
    type: String,
  })
  role: RoleUserEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
