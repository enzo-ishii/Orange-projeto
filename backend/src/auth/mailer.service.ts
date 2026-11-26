import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { WELCOME_EMAIL_SUBJECT, renderWelcomeEmailHtml, renderWelcomeEmailText } from './welcome-email.js';

type MailContent = { subject: string; text: string; html: string };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  isConfigured() {
    const host = process.env.SMTP_HOST?.trim();
    const user = process.env.SMTP_USER?.trim();
    const password = process.env.SMTP_PASSWORD?.trim();
    const from = process.env.SMTP_FROM?.trim() || user;
    return Boolean(host && user && password && from);
  }

  async sendPasswordReset(email: string, resetLink: string) {
    const sent = await this.send(email, {
      subject: 'Redefina sua senha da Orange',
      text: `Recebemos um pedido para redefinir sua senha. Use este link em ate 30 minutos: ${resetLink}\n\nSe voce nao pediu a redefinicao, ignore esta mensagem.`,
      html: `<p>Recebemos um pedido para redefinir sua senha da Orange.</p><p><a href="${resetLink}">Criar uma nova senha</a></p><p>O link expira em 30 minutos. Se voce nao pediu a redefinicao, ignore esta mensagem.</p>`,
    });
    if (!sent) this.logger.warn('SMTP ainda nao foi configurado; e-mail de redefinicao nao enviado.');
  }

  async sendWelcome(email: string) {
    const baseUrl = (process.env.FRONTEND_URL ?? 'https://bebaorange.com').replace(/\/$/, '');
    const privacyUrl = `${baseUrl}/privacidade`;
    const replyTo = process.env.SMTP_USER?.trim() ?? '';
    const unsubscribeUrl = `mailto:${replyTo}?subject=${encodeURIComponent('Não quero mais receber')}`;
    const sent = await this.send(email, {
      subject: WELCOME_EMAIL_SUBJECT,
      text: renderWelcomeEmailText({ privacyUrl, unsubscribeUrl }),
      html: renderWelcomeEmailHtml({ privacyUrl: escapeHtml(privacyUrl), unsubscribeUrl: escapeHtml(unsubscribeUrl) }),
    });
    if (!sent) this.logger.warn('SMTP ainda nao foi configurado; e-mail de boas-vindas nao enviado.');
  }

  private async send(to: string, content: MailContent) {
    const host = process.env.SMTP_HOST?.trim();
    const user = process.env.SMTP_USER?.trim();
    const password = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM?.trim() || user;
    if (!host || !user || !password?.trim() || !from) return false;

    const port = Number(process.env.SMTP_PORT ?? 465);
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: password },
    });
    try {
      await transport.sendMail({ from, to, ...content });
      return true;
    } finally {
      transport.close();
    }
  }
}
