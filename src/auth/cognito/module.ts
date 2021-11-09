import { Module } from '@nestjs/common';
import { CognitoService } from './cognito';

@Module({
  imports: [],
  controllers: [],
  providers: [CognitoService],
})
export class CognitoModule {}
