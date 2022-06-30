import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IExpressRequest } from '@app/types/expressRequest.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<IExpressRequest>();

    if (request.user) {
      return true;
    }

    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}
