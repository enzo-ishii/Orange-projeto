import { PrismaService } from '../database/prisma.service.js';
import { SmsProvider } from './sms.provider.js';
export declare class MobileAuthService {
    private readonly prisma;
    private readonly sms;
    constructor(prisma: PrismaService, sms: SmsProvider);
    start(phone: string): Promise<{
        ok: boolean;
    }>;
    verify(phone: string, code: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
    }>;
    customerIdFromToken(token: string): Promise<string>;
    signOut(token: string): Promise<void>;
}
