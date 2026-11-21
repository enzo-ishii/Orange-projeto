import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
export declare class MachineKeyGuard implements CanActivate {
    private readonly prisma;
    constructor(prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
