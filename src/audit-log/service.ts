import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async writeLog(
    module: string,
    action: string,
    request: Record<string, any>,
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

    const result = await this.auditLogRepository.save(log);

    return result.id;
  }
}
