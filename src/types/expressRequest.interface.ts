import { User } from '@app/user/user.entity';
import { Request } from 'express';

export interface IExpressRequest extends Request {
  user?: User;
}
