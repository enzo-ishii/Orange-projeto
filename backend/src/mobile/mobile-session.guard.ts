import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { MobileAuthService } from './mobile-auth.service.js';

export type MobileRequest = Request & { customerId: string };

/** Sessão do app: header "Authorization: Bearer <token>". */
@Injectable()
export class MobileSessionGuard implements CanActivate {
  constructor(private readonly auth: MobileAuthService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) throw new UnauthorizedException();
    (req as MobileRequest).customerId = await this.auth.customerIdFromToken(token);
    return true;
  }
}
