import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import { PrismaService } from '../database/prisma.service.js';

/** Autentica o leitor da máquina: header "X-Machine-Key" (guardamos só o sha256). */
@Injectable()
export class MachineKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const id = String(req.params.id ?? '');
    const key = String(req.headers['x-machine-key'] ?? '');
    const machine = id && key ? await this.prisma.machine.findUnique({ where: { id } }) : null;
    if (!machine) throw new UnauthorizedException();
    const a = Buffer.from(createHash('sha256').update(key).digest('hex'));
    const b = Buffer.from(machine.apiKeyHash);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new UnauthorizedException();
    return true;
  }
}
