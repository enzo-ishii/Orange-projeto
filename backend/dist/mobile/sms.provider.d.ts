export declare class SmsProvider {
    private readonly logger;
    private readonly sid;
    private readonly token;
    private readonly service;
    get usesTwilioVerify(): boolean;
    private auth;
    startVerification(phone: string): Promise<void>;
    checkVerification(phone: string, code: string): Promise<boolean>;
    logDevCode(phone: string, code: string): void;
}
