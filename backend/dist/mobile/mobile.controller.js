var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaService } from '../database/prisma.service.js';
import { MachineKeyGuard } from './machine-key.guard.js';
import { MobileAuthService } from './mobile-auth.service.js';
import { MobileSessionGuard } from './mobile-session.guard.js';
import { ConsentsDto, MachineTapDto, SmsStartDto, SmsVerifyDto, UpdateProfileDto } from './mobile.dto.js';
import { MobileService } from './mobile.service.js';
import { WalletPassService } from './wallet-pass.service.js';
let MobileController = class MobileController {
    auth;
    mobile;
    passes;
    prisma;
    constructor(auth, mobile, passes, prisma) {
        this.auth = auth;
        this.mobile = mobile;
        this.passes = passes;
        this.prisma = prisma;
    }
    start(body) {
        return this.auth.start(body.phone);
    }
    verify(body) {
        return this.auth.verify(body.phone, body.code);
    }
    logout(header = '') {
        return this.auth.signOut(header.replace(/^Bearer /, ''));
    }
    me(req) {
        return this.mobile.me(req.customerId);
    }
    updateMe(req, body) {
        return this.mobile.updateName(req.customerId, body.name);
    }
    consents(req, body) {
        return this.mobile.saveConsents(req.customerId, body);
    }
    exportData(req) {
        return this.mobile.export(req.customerId);
    }
    deleteMe(req) {
        return this.mobile.deleteAccount(req.customerId);
    }
    wallet(req) {
        return this.mobile.wallet(req.customerId);
    }
    async pass(req, res) {
        const c = await this.prisma.mobileCustomer.findUniqueOrThrow({ where: { id: req.customerId } });
        const buffer = await this.passes.build(c, await this.mobile.balanceCents(c.id));
        res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
        res.setHeader('Content-Disposition', 'attachment; filename="orange.pkpass"');
        res.send(buffer);
    }
    founders() {
        return this.mobile.founders();
    }
    machines() {
        return this.mobile.machines();
    }
    tap(id, body) {
        return this.mobile.tap(id, body);
    }
};
__decorate([
    Post('auth/sms/start'),
    HttpCode(200),
    UseGuards(ThrottlerGuard),
    Throttle({ default: { ttl: 60_000, limit: 5 } }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SmsStartDto]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "start", null);
__decorate([
    Post('auth/sms/verify'),
    HttpCode(200),
    UseGuards(ThrottlerGuard),
    Throttle({ default: { ttl: 60_000, limit: 10 } }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SmsVerifyDto]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "verify", null);
__decorate([
    Post('auth/logout'),
    HttpCode(200),
    __param(0, Headers('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "logout", null);
__decorate([
    Get('me'),
    UseGuards(MobileSessionGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "me", null);
__decorate([
    Put('me'),
    UseGuards(MobileSessionGuard),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "updateMe", null);
__decorate([
    Put('me/consents'),
    UseGuards(MobileSessionGuard),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ConsentsDto]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "consents", null);
__decorate([
    Post('me/export'),
    HttpCode(200),
    UseGuards(MobileSessionGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "exportData", null);
__decorate([
    Delete('me'),
    UseGuards(MobileSessionGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "deleteMe", null);
__decorate([
    Get('wallet'),
    UseGuards(MobileSessionGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "wallet", null);
__decorate([
    Get('wallet/pass'),
    UseGuards(MobileSessionGuard),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MobileController.prototype, "pass", null);
__decorate([
    Get('founders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "founders", null);
__decorate([
    Get('machines'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "machines", null);
__decorate([
    Post('machines/:id/tap'),
    HttpCode(200),
    UseGuards(MachineKeyGuard),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, MachineTapDto]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "tap", null);
MobileController = __decorate([
    Controller('mobile'),
    __metadata("design:paramtypes", [MobileAuthService,
        MobileService,
        WalletPassService,
        PrismaService])
], MobileController);
export { MobileController };
//# sourceMappingURL=mobile.controller.js.map