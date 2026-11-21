import { GoneException, HttpException, HttpStatus, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../database/prisma.service.js';
import { SmsProvider } from './sms.provider.js';

const CODE_TTL_MS = 5 * 60_000;       // código vale 5 min
const MAX_ATTEMPTS = 3;                // 3 tentativas por código
const RESEND_COOLDOWN_MS = 45_000;     // reenviar após 45 s
const SESSION_TTL_MS = 180 * 24 * 3600_000; // sessão fica salva ~6 meses

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

@Injectable()
export class MobileAuthService {
  constructor(private readonly prisma: PrismaService, private readonly sms: SmsProvider) {}

  async start(phone: string) {
    if (this.sms.usesTwilioVerify) {
      await this.sms.startVerification(phone);
      return { ok: true };
    }
    const last = await this.prisma.smsChallenge.findFirst({ where: { phone }, orderBy: { createdAt: 'desc' } });
    if (last && Date.now() - last.createdAt.getTime() < RESEND_COOLDOWN_MS) {
      throw new HttpException('Espere alguns segundos para pedir outro código.', HttpStatus.TOO_MANY_REQUESTS);
    }
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    await this.prisma.smsChallenge.create({
      data: { phone, codeHash: sha256(code), expiresAt: new Date(Date.now() + CODE_TTL_MS) },
    });
    this.sms.logDevCode(phone, code);
    return { ok: true };
  }

  async verify(phone: string, code: string) {
    if (this.sms.usesTwilioVerify) {
      const ok = await this.sms.checkVerification(phone, code);
      if (!ok) throw new BadRequestException('Código errado ou vencido.');
    } else {
      const ch = await this.prisma.smsChallenge.findFirst({ where: { phone }, orderBy: { createdAt: 'desc' } });
      if (!ch || ch.expiresAt.getTime() < Date.now()) throw new GoneException('Esse código venceu. Peça um novo.');
      if (ch.attempts >= MAX_ATTEMPTS) throw new HttpException('Muitas tentativas. Peça um novo código.', HttpStatus.TOO_MANY_REQUESTS);
      const a = Buffer.from(sha256(code)); const b = Buffer.from(ch.codeHash);
      if (!timingSafeEqual(a, b)) {
        await this.prisma.smsChallenge.update({ where: { id: ch.id }, data: { attempts: { increment: 1 } } });
        throw new BadRequestException('Código errado.');
      }
      await this.prisma.smsChallenge.deleteMany({ where: { phone } });
    }

    const customer = await this.prisma.mobileCustomer.upsert({
      where: { phone },
      update: {},
      create: { phone, cardNfcId: randomBytes(16).toString('hex'), passSerial: randomBytes(16).toString('hex') },
    });
    const token = randomBytes(32).toString('base64url');
    await this.prisma.mobileSession.create({
      data: { tokenHash: sha256(token), customerId: customer.id, expiresAt: new Date(Date.now() + SESSION_TTL_MS) },
    });
    return { token, user: { id: customer.id, name: customer.name ?? '', phone: customer.phone } };
  }

  async customerIdFromToken(token: string) {
    const s = await this.prisma.mobileSession.findUnique({ where: { tokenHash: sha256(token) } });
    if (!s || s.expiresAt.getTime() < Date.now()) throw new UnauthorizedException();
    return s.customerId;
  }

  async signOut(token: string) {
    await this.prisma.mobileSession.deleteMany({ where: { tokenHash: sha256(token) } });
  }
}
