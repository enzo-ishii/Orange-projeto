var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
const FOUNDERS_LIMIT = 1000;
const BOTTLE_CREDIT_CENTS = 100;
let MobileService = class MobileService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async me(customerId) {
        const c = await this.prisma.mobileCustomer.findUnique({ where: { id: customerId } });
        if (!c)
            throw new NotFoundException();
        return { id: c.id, name: c.name ?? '', phone: c.phone, foundersNumber: c.foundersNumber };
    }
    updateName(customerId, name) {
        return this.prisma.mobileCustomer.update({ where: { id: customerId }, data: { name: name.trim() } });
    }
    async balanceCents(customerId) {
        const agg = await this.prisma.walletLedgerEntry.aggregate({ where: { customerId }, _sum: { amountCents: true } });
        return agg._sum.amountCents ?? 0;
    }
    async wallet(customerId) {
        const [balanceCents, entries] = await Promise.all([
            this.balanceCents(customerId),
            this.prisma.walletLedgerEntry.findMany({ where: { customerId }, orderBy: { createdAt: 'desc' }, take: 100 }),
        ]);
        return {
            balance: balanceCents / 100,
            entries: entries.map((e) => ({ id: e.id, title: e.description, date: e.createdAt, amount: e.amountCents / 100 })),
        };
    }
    saveConsents(customerId, dto) {
        return this.prisma.mobileConsent.create({
            data: { customerId, termsVersion: dto.termsVersion, marketing: dto.marketing, personalization: dto.personalization },
        });
    }
    async export(customerId) {
        const c = await this.prisma.mobileCustomer.findUnique({
            where: { id: customerId },
            include: { ledger: true, consents: true },
        });
        return { generatedAt: new Date(), customer: c };
    }
    async deleteAccount(customerId) {
        await this.prisma.mobileCustomer.delete({ where: { id: customerId } });
        return { ok: true };
    }
    async founders() {
        const taken = await this.prisma.mobileCustomer.count({ where: { foundersNumber: { not: null } } });
        return { limit: FOUNDERS_LIMIT, taken, remaining: Math.max(0, FOUNDERS_LIMIT - taken) };
    }
    async claimFounders(customerId) {
        return this.prisma.$transaction(async (tx) => {
            const c = await tx.mobileCustomer.findUnique({ where: { id: customerId } });
            if (!c)
                throw new NotFoundException();
            if (c.foundersNumber)
                return c.foundersNumber;
            const taken = await tx.mobileCustomer.count({ where: { foundersNumber: { not: null } } });
            if (taken >= FOUNDERS_LIMIT)
                return null;
            const updated = await tx.mobileCustomer.update({ where: { id: customerId }, data: { foundersNumber: taken + 1 } });
            return updated.foundersNumber;
        });
    }
    async machines() {
        const list = await this.prisma.machine.findMany({ orderBy: { name: 'asc' } });
        return list.map((m) => ({
            id: m.id, name: m.name, address: m.address, latitude: m.latitude, longitude: m.longitude,
            status: m.status === 'OPEN' ? 'open' : m.status === 'CLOSED' ? 'closed' : 'maintenance',
            hours: m.hours,
            features: [m.hasJuice ? 'juice' : null, m.acceptsReturns ? 'bottleReturn' : null, 'cardTap'].filter(Boolean),
            bottlesAvailable: m.bottlesAvailable,
        }));
    }
    async tap(machineId, dto) {
        const c = await this.prisma.mobileCustomer.findUnique({ where: { cardNfcId: dto.nfcId } });
        if (!c)
            throw new NotFoundException('Cartão não encontrado.');
        if (dto.action === 'return') {
            const bottles = dto.bottles ?? 1;
            await this.prisma.walletLedgerEntry.create({
                data: { customerId: c.id, kind: 'BOTTLE_RETURN', amountCents: bottles * BOTTLE_CREDIT_CENTS,
                    description: `${bottles} garrafa${bottles > 1 ? 's' : ''} devolvida${bottles > 1 ? 's' : ''}`, machineId },
            });
        }
        else {
            const amount = dto.amountCents ?? 0;
            const balance = await this.balanceCents(c.id);
            if (amount <= 0 || amount > balance)
                throw new BadRequestException('Saldo insuficiente.');
            await this.prisma.walletLedgerEntry.create({
                data: { customerId: c.id, kind: 'SPEND', amountCents: -amount, description: 'Usado na máquina', machineId },
            });
        }
        return { ok: true, name: c.name, balance: (await this.balanceCents(c.id)) / 100 };
    }
};
MobileService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], MobileService);
export { MobileService };
//# sourceMappingURL=mobile.service.js.map