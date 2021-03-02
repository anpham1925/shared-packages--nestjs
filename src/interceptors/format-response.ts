import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { METADATA } from '../audit-log';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector | null = null) {
    this.reflector = reflector;
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let willFormat = !(
      this.reflector &&
      this.reflector.get<string>(
        METADATA.EXCEPTION_FORMAT_ROUTES,
        context.getHandler(),
      )
    );

    return next.handle().pipe(
      map((data) => {
        return willFormat ? { success: true, result: data } : data;
      }),
    );
  }
}
