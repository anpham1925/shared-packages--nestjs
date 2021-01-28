import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entity';
import { AuditLogService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [],
  providers: [AuditLogService],
})
export class AuditLogModule {}
