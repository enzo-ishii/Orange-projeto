import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Response } from 'express';
import { PrismaService } from '../database/prisma.service.js';
import { MachineKeyGuard } from './machine-key.guard.js';
import { MobileAuthService } from './mobile-auth.service.js';
import { MobileRequest, MobileSessionGuard } from './mobile-session.guard.js';
import { ConsentsDto, MachineTapDto, SmsStartDto, SmsVerifyDto, UpdateProfileDto } from './mobile.dto.js';
import { MobileService } from './mobile.service.js';
import { WalletPassService } from './wallet-pass.service.js';

/** Rotas do app iOS: /api/mobile/* */
@Controller('mobile')
export class MobileController {
  constructor(
    private readonly auth: MobileAuthService,
    private readonly mobile: MobileService,
    private readonly passes: WalletPassService,
    private readonly prisma: PrismaService,
  ) {}

  // ── Login por SMS ──
  @Post('auth/sms/start')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  start(@Body() body: SmsStartDto) {
    return this.auth.start(body.phone);
  }

  @Post('auth/sms/verify')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  verify(@Body() body: SmsVerifyDto) {
    return this.auth.verify(body.phone, body.code);
  }

  @Post('auth/logout')
  @HttpCode(200)
  logout(@Headers('authorization') header = '') {
    return this.auth.signOut(header.replace(/^Bearer /, ''));
  }

  // ── Conta ──
  @Get('me')
  @UseGuards(MobileSessionGuard)
  me(@Req() req: MobileRequest) {
    return this.mobile.me(req.customerId);
  }

  @Put('me')
  @UseGuards(MobileSessionGuard)
  updateMe(@Req() req: MobileRequest, @Body() body: UpdateProfileDto) {
    return this.mobile.updateName(req.customerId, body.name);
  }

  @Put('me/consents')
  @UseGuards(MobileSessionGuard)
  consents(@Req() req: MobileRequest, @Body() body: ConsentsDto) {
    return this.mobile.saveConsents(req.customerId, body);
  }

  @Post('me/export')
  @HttpCode(200)
  @UseGuards(MobileSessionGuard)
  exportData(@Req() req: MobileRequest) {
    return this.mobile.export(req.customerId);
  }

  @Delete('me')
  @UseGuards(MobileSessionGuard)
  deleteMe(@Req() req: MobileRequest) {
    return this.mobile.deleteAccount(req.customerId);
  }

  // ── Saldo e cartão ──
  @Get('wallet')
  @UseGuards(MobileSessionGuard)
  wallet(@Req() req: MobileRequest) {
    return this.mobile.wallet(req.customerId);
  }

  @Get('wallet/pass')
  @UseGuards(MobileSessionGuard)
  async pass(@Req() req: MobileRequest, @Res() res: Response) {
    const c = await this.prisma.mobileCustomer.findUniqueOrThrow({ where: { id: req.customerId } });
    const buffer = await this.passes.build(c, await this.mobile.balanceCents(c.id));
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', 'attachment; filename="orange.pkpass"');
    res.send(buffer);
  }

  // ── Founders Edition ──
  @Get('founders')
  founders() {
    return this.mobile.founders();
  }

  // ── Máquinas ──
  @Get('machines')
  machines() {
    return this.mobile.machines();
  }

  /** Leitor da máquina → API (header X-Machine-Key). */
  @Post('machines/:id/tap')
  @HttpCode(200)
  @UseGuards(MachineKeyGuard)
  tap(@Param('id') id: string, @Body() body: MachineTapDto) {
    return this.mobile.tap(id, body);
  }
}
