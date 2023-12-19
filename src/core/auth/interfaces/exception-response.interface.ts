import { Request } from 'express';
import { UserDocument } from 'src/v1/users/schemas/user.schema';

export interface RequestExpress extends Request {
  user: UserDocument;
}
