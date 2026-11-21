import { PrismaService } from '../database/prisma.service.js';
import { ConsentsDto, MachineTapDto } from './mobile.dto.js';
export declare class MobileService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    me(customerId: string): Promise<{
        id: string;
        name: string;
        phone: string;
        foundersNumber: number | null;
    }>;
    updateName(customerId: string, name: string): import("../generated/prisma/models.js").Prisma__MobileCustomerClient<{
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
    balanceCents(customerId: string): Promise<number>;
    wallet(customerId: string): Promise<{
        balance: number;
        entries: {
            id: string;
            title: string;
            date: Date;
            amount: number;
        }[];
    }>;
    saveConsents(customerId: string, dto: ConsentsDto): import("../generated/prisma/models.js").Prisma__MobileConsentClient<{
        id: string;
        createdAt: Date;
        customerId: string;
        termsVersion: string;
        marketing: boolean;
        personalization: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    export(customerId: string): Promise<{
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
    deleteAccount(customerId: string): Promise<{
        ok: boolean;
    }>;
    founders(): Promise<{
        limit: number;
        taken: number;
        remaining: number;
    }>;
    claimFounders(customerId: string): Promise<number | null>;
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
    tap(machineId: string, dto: MachineTapDto): Promise<{
        ok: boolean;
        name: string | null;
        balance: number;
    }>;
}
