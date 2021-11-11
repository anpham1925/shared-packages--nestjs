import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DefaultAuthService } from '../auth/default/service';

@Injectable()
export class TokenCheckerMiddleware implements NestMiddleware {
  constructor(private readonly defaultAuthService: DefaultAuthService) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeaders = req.headers;
    const tokenString =
      authHeaders &&
      authHeaders.authorization &&
      authHeaders.authorization.split(' ').length > 1
        ? authHeaders.authorization.split(' ')[1]
        : '';

    (req as any).currentUser = this.defaultAuthService.verifyToken(tokenString);
    next();
  }
}
