import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entity';
import { Request } from 'express';

export interface CustomRequest extends Request {
  authInstance?: any;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async writeLog(
    module: string,
    action: string,
    request: CustomRequest,
    restricted: boolean = false,
  ): Promise<string | number> {
    const log = new AuditLog();

    log.userId = request.authInstance ? request.authInstance.id : null;
    log.email = request.authInstance ? request.authInstance.email : null;
    log.role = request.authInstance ? request.authInstance.role : null;

    log.action = action;
    log.module = module;
    log.url = request.originalUrl;
    log.content = restricted ? '' : request.body;
    const xForwardedFor = request.headers['x-forwarded-for'];
    log.ip =
      typeof xForwardedFor === 'string'
        ? xForwardedFor
        : xForwardedFor?.join(', ') || request.ips.join(', ') || request.ip;

    const result = await this.auditLogRepository.save(log);

    return result.id;
  }
}
