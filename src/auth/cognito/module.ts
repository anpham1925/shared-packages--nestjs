import { Module } from '@nestjs/common';
import { CognitoService } from './cognito';

@Module({
  imports: [],
  controllers: [],
  providers: [CognitoService],
  exports: [CognitoService],
})
export class CognitoModule {}
