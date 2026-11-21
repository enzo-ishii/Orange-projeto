var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, Logger } from '@nestjs/common';
let SmsProvider = class SmsProvider {
    logger = new Logger('SMS');
    sid = process.env.TWILIO_ACCOUNT_SID;
    token = process.env.TWILIO_AUTH_TOKEN;
    service = process.env.TWILIO_VERIFY_SERVICE_SID;
    get usesTwilioVerify() {
        return Boolean(this.sid && this.token && this.service);
    }
    auth() {
        return 'Basic ' + Buffer.from(`${this.sid}:${this.token}`).toString('base64');
    }
    async startVerification(phone) {
        const res = await fetch(`https://verify.twilio.com/v2/Services/${this.service}/Verifications`, {
            method: 'POST',
            headers: { Authorization: this.auth(), 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ To: phone, Channel: 'sms', Locale: 'pt-BR' }),
        });
        if (!res.ok) {
            this.logger.error(`Twilio Verify start falhou: ${res.status}`);
            throw new Error('sms_failed');
        }
    }
    async checkVerification(phone, code) {
        const res = await fetch(`https://verify.twilio.com/v2/Services/${this.service}/VerificationCheck`, {
            method: 'POST',
            headers: { Authorization: this.auth(), 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ To: phone, Code: code }),
        });
        if (res.status === 404)
            return false;
        if (!res.ok)
            throw new Error('sms_failed');
        const json = (await res.json());
        return json.status === 'approved';
    }
    logDevCode(phone, code) {
        if (process.env.NODE_ENV === 'production') {
            this.logger.error('SMS sem provedor em produção: configure o Twilio Verify.');
            return;
        }
        this.logger.warn(`[dev] código para ${phone}: ${code}`);
    }
};
SmsProvider = __decorate([
    Injectable()
], SmsProvider);
export { SmsProvider };
//# sourceMappingURL=sms.provider.js.map