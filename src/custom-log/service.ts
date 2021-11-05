import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
  ) {}

  async writeLog(
    exception: unknown,
    request: Record<string, any>,
  ): Promise<string> {
    const customException = exception as any;
    const log = new Log();

    log.generatedBy = request.user ? request.user.id : null;
    log.url = request.originalUrl;

    log.detail = `${customException?.response?.error}`;
    log.general = `${exception}`;

    const result = await this.logRepository.save(log);

    return result.id;
  }
}
