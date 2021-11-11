import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DefaultAuthService } from './service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [DefaultAuthService],
  exports: [DefaultAuthService],
})
export class DefaultAuthModule {}
