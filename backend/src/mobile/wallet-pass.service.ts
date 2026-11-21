import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

/**
 * Gera o cartão Orange (.pkpass) para a Apple Wallet.
 * O cartão é só de identificação (Store Card com NFC/VAS): a máquina lê `cardNfcId`.
 *
 * Requisitos (não dá pra fazer sem eles):
 *  - Apple Developer Program (US$ 99/ano) e um Pass Type ID (ex.: pass.com.bebaorange.cartao)
 *  - Certificado do Pass Type ID e certificado WWDR da Apple, em PEM
 *  - NFC em passes exige pedido de "NFC Certificate" à Apple (formulário de Wallet NFC)
 *  - Dependência `passkit-generator` (npm i passkit-generator) — carregada só se existir
 *
 * Variáveis: WALLET_PASS_TYPE_ID, WALLET_TEAM_ID, WALLET_SIGNER_CERT_PEM, WALLET_SIGNER_KEY_PEM,
 * WALLET_SIGNER_KEY_PASSPHRASE, WALLET_WWDR_PEM, WALLET_NFC_PUBLIC_KEY (chave de criptografia VAS).
 */
@Injectable()
export class WalletPassService {
  get configured() {
    return Boolean(process.env.WALLET_PASS_TYPE_ID && process.env.WALLET_SIGNER_CERT_PEM && process.env.WALLET_WWDR_PEM);
  }

  async build(customer: { passSerial: string; cardNfcId: string; name: string | null; foundersNumber: number | null }, balanceCents: number) {
    if (!this.configured) {
      throw new HttpException(
        'Cartão na Wallet ainda não configurado: falta o certificado do Pass Type ID da Apple.',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    let PKPass: any;
    try {
      const mod = 'passkit-generator';
      ({ PKPass } = await import(mod));
    } catch {
      throw new HttpException('Instale a dependência passkit-generator no backend.', HttpStatus.NOT_IMPLEMENTED);
    }
    const env = process.env;
    const pem = (s?: string) => (s ?? '').replace(/\\n/g, '\n');
    const pass = new PKPass({}, {
      wwdr: pem(env.WALLET_WWDR_PEM),
      signerCert: pem(env.WALLET_SIGNER_CERT_PEM),
      signerKey: pem(env.WALLET_SIGNER_KEY_PEM),
      signerKeyPassphrase: env.WALLET_SIGNER_KEY_PASSPHRASE,
    }, {
      formatVersion: 1,
      passTypeIdentifier: env.WALLET_PASS_TYPE_ID,
      teamIdentifier: env.WALLET_TEAM_ID,
      organizationName: 'Orange',
      description: 'Cartão Orange',
      serialNumber: customer.passSerial,
      foregroundColor: 'rgb(17,17,17)',
      backgroundColor: 'rgb(255,106,0)',
      labelColor: 'rgb(17,17,17)',
      logoText: 'Orange.',
      sharingProhibited: true,
    });
    pass.type = 'storeCard';
    pass.primaryFields.push({ key: 'balance', label: 'SALDO', value: balanceCents / 100, currencyCode: 'BRL' });
    pass.secondaryFields.push({ key: 'name', label: 'NOME', value: customer.name ?? '' });
    if (customer.foundersNumber) {
      pass.auxiliaryFields.push({ key: 'founders', label: 'FOUNDERS EDITION', value: `#${String(customer.foundersNumber).padStart(4, '0')}` });
    }
    // NFC (Value Added Services): a máquina recebe esta mensagem ao encostar o iPhone. Sem QR (decisão da marca).
    if (env.WALLET_NFC_PUBLIC_KEY) {
      pass.setNFC({ message: customer.cardNfcId, encryptionPublicKey: env.WALLET_NFC_PUBLIC_KEY });
    }
    return pass.getAsBuffer() as Buffer;
  }
}
