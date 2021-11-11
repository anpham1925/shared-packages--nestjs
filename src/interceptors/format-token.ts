import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { DefaultAuthService } from '../auth/default/service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private defaultAuthService: DefaultAuthService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request) {
      const authHeaders = request.headers;
      const tokenString =
        authHeaders.authorization?.split(' ').length > 1
          ? authHeaders.authorization.split(' ')[1]
          : '';
      request.currentUser = this.defaultAuthService.verifyToken(tokenString);
    }

    return next.handle();
  }
}
