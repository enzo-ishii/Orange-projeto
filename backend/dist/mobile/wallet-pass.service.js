var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
let WalletPassService = class WalletPassService {
    get configured() {
        return Boolean(process.env.WALLET_PASS_TYPE_ID && process.env.WALLET_SIGNER_CERT_PEM && process.env.WALLET_WWDR_PEM);
    }
    async build(customer, balanceCents) {
        if (!this.configured) {
            throw new HttpException('Cartão na Wallet ainda não configurado: falta o certificado do Pass Type ID da Apple.', HttpStatus.NOT_IMPLEMENTED);
        }
        let PKPass;
        try {
            const mod = 'passkit-generator';
            ({ PKPass } = await import(mod));
        }
        catch {
            throw new HttpException('Instale a dependência passkit-generator no backend.', HttpStatus.NOT_IMPLEMENTED);
        }
        const env = process.env;
        const pem = (s) => (s ?? '').replace(/\\n/g, '\n');
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
        if (env.WALLET_NFC_PUBLIC_KEY) {
            pass.setNFC({ message: customer.cardNfcId, encryptionPublicKey: env.WALLET_NFC_PUBLIC_KEY });
        }
        return pass.getAsBuffer();
    }
};
WalletPassService = __decorate([
    Injectable()
], WalletPassService);
export { WalletPassService };
//# sourceMappingURL=wallet-pass.service.js.map