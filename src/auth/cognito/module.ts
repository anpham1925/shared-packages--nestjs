import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CognitoService } from './cognito';

@Module({
  imports: [],
  controllers: [],
  providers: [CognitoService],
  exports: [CognitoService],
})
export class CognitoModule {}
