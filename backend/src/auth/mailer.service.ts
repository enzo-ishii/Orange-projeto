import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

type Mensagem = { to: string; subject: string; text: string; html: string };

// escapa o que vem do usuário (nome) antes de entrar no HTML do e-mail
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// moldura dos e-mails da Orange: estilos inline (clientes de e-mail ignoram <style>)
function layout(titulo: string, corpo: string) {
  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#F4EFE7;font-family:Arial,Helvetica,sans-serif;color:#1A1410">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4EFE7;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden">
<tr><td style="background:#FF6A00;padding:28px 32px;font:bold 28px Georgia,serif;color:#1A1410">Orange.</td></tr>
<tr><td style="padding:32px">
<h1 style="margin:0 0 16px;font:bold 26px/1.2 Georgia,serif;color:#1A1410">${titulo}</h1>
${corpo}
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #EFE7DB;font-size:12px;color:#8A8178">Orange · suco de laranja 100% natural · Brasília, DF</td></tr>
</table></td></tr></table></body></html>`;
}

const p = (t: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#4A433C">${t}</p>`;
const botao = (href: string, rotulo: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="display:inline-block;background:#FF6A00;color:#1A1410;text-decoration:none;font-weight:bold;padding:14px 26px;border-radius:999px">${rotulo}</a></p>`;

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

  private siteUrl() {
    return (process.env.FRONTEND_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  }

  private async enviar(msg: Mensagem) {
    const host = process.env.SMTP_HOST?.trim();
    const user = process.env.SMTP_USER?.trim();
    const password = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM?.trim() || user;
    if (!host || !user || !password?.trim() || !from) {
      this.logger.warn(`SMTP ainda não foi configurado; e-mail "${msg.subject}" não enviado.`);
      return;
    }
    const port = Number(process.env.SMTP_PORT ?? 465);
    const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass: password } });
    try {
      await transport.sendMail({ from, ...msg });
    } finally {
      transport.close();
    }
  }

  async sendPasswordReset(email: string, resetLink: string) {
    await this.enviar({
      to: email,
      subject: 'Redefina sua senha da Orange',
      text: `Recebemos um pedido para redefinir sua senha. Use este link em até 30 minutos: ${resetLink}\n\nSe você não pediu a redefinição, ignore esta mensagem.`,
      html: layout('Redefina sua senha', p('Recebemos um pedido para redefinir a senha da sua conta Orange.') + botao(resetLink, 'Criar uma nova senha') + p('O link expira em 30 minutos. Se você não pediu a redefinição, ignore esta mensagem.')),
    });
  }

  // boas-vindas a quem acabou de criar conta (por e-mail e senha ou pelo Google/Apple)
  async sendWelcome(email: string, name?: string | null) {
    const primeiro = name?.trim().split(/\s+/)[0] ?? '';
    const ola = primeiro ? `Olá, ${primeiro}!` : 'Olá!';
    const site = this.siteUrl();
    await this.enviar({
      to: email,
      subject: 'Bem-vindo à Orange 🍊',
      text: [
        ola,
        '',
        'Sua conta Orange foi criada. A partir de agora você acompanha pedidos, assinatura e cashback num só lugar.',
        '',
        'Como funciona:',
        '1. Escolha um plano: Gominho, Citrus ou Orange+.',
        '2. Receba o suco gelado, feito no dia, em Brasília.',
        '3. Devolva a garrafa e ganhe cashback.',
        '',
        `Entrar na sua conta: ${site}/login`,
        '',
        'Se não foi você que criou esta conta, responda este e-mail que a gente resolve.',
        '',
        'Equipe Orange',
      ].join('\n'),
      html: layout(
        esc(ola),
        p('Sua conta Orange foi criada. A partir de agora você acompanha pedidos, assinatura e cashback num só lugar.') +
          `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px">
${[['1', 'Escolha um plano: Gominho, Citrus ou Orange+.'], ['2', 'Receba o suco gelado, feito no dia, em Brasília.'], ['3', 'Devolva a garrafa e ganhe cashback.']]
  .map(([n, t]) => `<tr><td style="width:30px;vertical-align:top;font:bold 15px Georgia,serif;color:#FF6A00">${n}</td><td style="padding-bottom:10px;font-size:15px;line-height:1.5;color:#4A433C">${t}</td></tr>`)
  .join('')}
</table>` +
          botao(`${site}/login`, 'Entrar na minha conta') +
          p('Se não foi você que criou esta conta, responda este e-mail que a gente resolve.') +
          p('Equipe Orange'),
      ),
    });
  }
}
