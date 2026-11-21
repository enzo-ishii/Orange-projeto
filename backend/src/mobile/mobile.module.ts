import { Module } from '@nestjs/common';
import { MachineKeyGuard } from './machine-key.guard.js';
import { MobileAuthService } from './mobile-auth.service.js';
import { MobileController } from './mobile.controller.js';
import { MobileSessionGuard } from './mobile-session.guard.js';
import { MobileService } from './mobile.service.js';
import { SmsProvider } from './sms.provider.js';
import { WalletPassService } from './wallet-pass.service.js';

@Module({
  controllers: [MobileController],
  providers: [MobileAuthService, MobileService, SmsProvider, WalletPassService, MobileSessionGuard, MachineKeyGuard],
})
export class MobileModule {}
