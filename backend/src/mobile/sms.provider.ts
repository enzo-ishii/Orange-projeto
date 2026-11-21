import { Injectable, Logger } from '@nestjs/common';

/**
 * Envio e checagem do código por SMS.
 * Com TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_VERIFY_SERVICE_SID usa o Twilio Verify
 * (o Twilio gera, envia e confere o código). Sem eles, o MobileAuthService gera o código e,
 * fora de produção, só registra no log (modo desenvolvimento).
 */
@Injectable()
export class SmsProvider {
  private readonly logger = new Logger('SMS');
  private readonly sid = process.env.TWILIO_ACCOUNT_SID;
  private readonly token = process.env.TWILIO_AUTH_TOKEN;
  private readonly service = process.env.TWILIO_VERIFY_SERVICE_SID;

  get usesTwilioVerify() {
    return Boolean(this.sid && this.token && this.service);
  }

  private auth() {
    return 'Basic ' + Buffer.from(`${this.sid}:${this.token}`).toString('base64');
  }

  async startVerification(phone: string) {
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

  /** true = código certo; false = errado/vencido */
  async checkVerification(phone: string, code: string) {
    const res = await fetch(`https://verify.twilio.com/v2/Services/${this.service}/VerificationCheck`, {
      method: 'POST',
      headers: { Authorization: this.auth(), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: phone, Code: code }),
    });
    if (res.status === 404) return false; // verificação vencida ou já usada
    if (!res.ok) throw new Error('sms_failed');
    const json = (await res.json()) as { status?: string };
    return json.status === 'approved';
  }

  /** Modo desenvolvimento: sem provedor configurado, mostra o código no log. */
  logDevCode(phone: string, code: string) {
    if (process.env.NODE_ENV === 'production') {
      this.logger.error('SMS sem provedor em produção: configure o Twilio Verify.');
      return;
    }
    this.logger.warn(`[dev] código para ${phone}: ${code}`);
  }
}
