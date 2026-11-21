import type { Response } from 'express';
import { PrismaService } from '../database/prisma.service.js';
import { MobileAuthService } from './mobile-auth.service.js';
import { MobileRequest } from './mobile-session.guard.js';
import { ConsentsDto, FirebaseLoginDto, MachineTapDto, SmsStartDto, SmsVerifyDto, UpdateProfileDto } from './mobile.dto.js';
import { MobileService } from './mobile.service.js';
import { WalletPassService } from './wallet-pass.service.js';
export declare class MobileController {
    private readonly auth;
    private readonly mobile;
    private readonly passes;
    private readonly prisma;
    constructor(auth: MobileAuthService, mobile: MobileService, passes: WalletPassService, prisma: PrismaService);
    start(body: SmsStartDto): Promise<{
        ok: boolean;
    }>;
    verify(body: SmsVerifyDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
    }>;
    firebase(body: FirebaseLoginDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
    }>;
    logout(header?: string): Promise<void>;
    me(req: MobileRequest): Promise<{
        id: string;
        name: string;
        phone: string;
        foundersNumber: number | null;
    }>;
    updateMe(req: MobileRequest, body: UpdateProfileDto): import("../generated/prisma/models.js").Prisma__MobileCustomerClient<{
        id: string;
        phone: string;
        createdAt: Date;
        name: string | null;
        cardNfcId: string;
        passSerial: string;
        foundersNumber: number | null;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    consents(req: MobileRequest, body: ConsentsDto): import("../generated/prisma/models.js").Prisma__MobileConsentClient<{
        id: string;
        createdAt: Date;
        customerId: string;
        termsVersion: string;
        marketing: boolean;
        personalization: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    exportData(req: MobileRequest): Promise<{
        generatedAt: Date;
        customer: ({
            ledger: {
                id: string;
                createdAt: Date;
                customerId: string;
                amountCents: number;
                kind: import("../generated/prisma/enums.js").LedgerKind;
                description: string;
                machineId: string | null;
            }[];
            consents: {
                id: string;
                createdAt: Date;
                customerId: string;
                termsVersion: string;
                marketing: boolean;
                personalization: boolean;
            }[];
        } & {
            id: string;
            phone: string;
            createdAt: Date;
            name: string | null;
            cardNfcId: string;
            passSerial: string;
            foundersNumber: number | null;
            updatedAt: Date;
        }) | null;
    }>;
    deleteMe(req: MobileRequest): Promise<{
        ok: boolean;
    }>;
    wallet(req: MobileRequest): Promise<{
        balance: number;
        entries: {
            id: string;
            title: string;
            date: Date;
            amount: number;
        }[];
    }>;
    pass(req: MobileRequest, res: Response): Promise<void>;
    founders(): Promise<{
        limit: number;
        taken: number;
        remaining: number;
    }>;
    machines(): Promise<{
        id: string;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        status: string;
        hours: string;
        features: (string | null)[];
        bottlesAvailable: number;
    }[]>;
    tap(id: string, body: MachineTapDto): Promise<{
        ok: boolean;
        name: string | null;
        balance: number;
    }>;
}
