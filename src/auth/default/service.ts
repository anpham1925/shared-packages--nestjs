import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export interface VerifyTokenResult {
  data: any;
  success: boolean;
  message?: string;
}

@Injectable()
export class DefaultAuthService {
  jwtSecret: string;
  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || '';
  }

  verifyToken(token: string): VerifyTokenResult {
    try {
      const data = jwt.verify(token, this.jwtSecret);
      return { data, success: true };
    } catch (error: any) {
      return { data: null, success: false, message: error.message };
    }
  }
}
