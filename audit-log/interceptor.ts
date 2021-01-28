import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { METADATA } from './metadata';
import { AuditLogService } from './service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private readonly auditLogService: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const action = this.reflector.get<string>(
          METADATA.ACTION,
          context.getHandler(),
        );

        const exception = this.reflector.get<string>(
          METADATA.CONFIDENTIAL_BODY,
          context.getHandler(),
        );

        const module = this.reflector.get<string>(
          METADATA.MODULE,
          context.getClass(),
        );

        if (action) {
          const request = context.switchToHttp().getRequest();
          this.auditLogService.writeLog(
            module,
            action,
            request,
            exception ? true : false,
          );
        }
        return data;
      }),
    );
  }
}
