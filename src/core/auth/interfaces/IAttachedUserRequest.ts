import { Request } from 'express';
import { User } from 'src/v1/users/schemas/user.schema';

export interface IAttachedUserRequest extends Request {
  user: User;
}
