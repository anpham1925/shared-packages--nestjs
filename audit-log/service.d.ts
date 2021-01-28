import { Repository } from 'typeorm';
import { AuditLog } from './entity';
export declare class AuditLogService {
    private readonly auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLog>);
    writeLog(module: string, action: string, request: Record<string, any>, restricted?: boolean): Promise<number>;
}
