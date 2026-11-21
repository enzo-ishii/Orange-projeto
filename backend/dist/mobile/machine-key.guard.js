var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../database/prisma.service.js';
let MachineKeyGuard = class MachineKeyGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const id = String(req.params.id ?? '');
        const key = String(req.headers['x-machine-key'] ?? '');
        const machine = id && key ? await this.prisma.machine.findUnique({ where: { id } }) : null;
        if (!machine)
            throw new UnauthorizedException();
        const a = Buffer.from(createHash('sha256').update(key).digest('hex'));
        const b = Buffer.from(machine.apiKeyHash);
        if (a.length !== b.length || !timingSafeEqual(a, b))
            throw new UnauthorizedException();
        return true;
    }
};
MachineKeyGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], MachineKeyGuard);
export { MachineKeyGuard };
//# sourceMappingURL=machine-key.guard.js.map