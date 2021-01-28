import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuditLogService } from './service';
export declare class AuditLogInterceptor implements NestInterceptor {
    private reflector;
    private readonly auditLogService;
    constructor(reflector: Reflector, auditLogService: AuditLogService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
