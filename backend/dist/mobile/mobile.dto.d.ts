export declare class SmsStartDto {
    phone: string;
}
export declare class SmsVerifyDto {
    phone: string;
    code: string;
}
export declare class UpdateProfileDto {
    name: string;
}
export declare class ConsentsDto {
    termsVersion: string;
    marketing: boolean;
    personalization: boolean;
    acceptedAt?: string;
}
export declare class MachineTapDto {
    nfcId: string;
    action: 'spend' | 'return';
    amountCents?: number;
    bottles?: number;
}
