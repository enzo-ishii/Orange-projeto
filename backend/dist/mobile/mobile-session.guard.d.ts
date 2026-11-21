import { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { MobileAuthService } from './mobile-auth.service.js';
export type MobileRequest = Request & {
    customerId: string;
};
export declare class MobileSessionGuard implements CanActivate {
    private readonly auth;
    constructor(auth: MobileAuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
