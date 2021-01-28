import { CommonEntity } from '../common/entities/common.entity';
export declare class AuditLog extends CommonEntity {
    action: string;
    module: string;
    userId: number;
    role: string;
    email: string;
    content: Record<string, unknown>;
    url: string;
}
