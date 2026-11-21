var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';
const E164_BR = /^\+55\d{10,11}$/;
export class SmsStartDto {
    phone;
}
__decorate([
    Matches(E164_BR, { message: 'Celular inválido.' }),
    __metadata("design:type", String)
], SmsStartDto.prototype, "phone", void 0);
export class SmsVerifyDto {
    phone;
    code;
}
__decorate([
    Matches(E164_BR, { message: 'Celular inválido.' }),
    __metadata("design:type", String)
], SmsVerifyDto.prototype, "phone", void 0);
__decorate([
    Matches(/^\d{6}$/, { message: 'O código tem 6 dígitos.' }),
    __metadata("design:type", String)
], SmsVerifyDto.prototype, "code", void 0);
export class UpdateProfileDto {
    name;
}
__decorate([
    IsString(),
    Length(1, 120),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
export class ConsentsDto {
    termsVersion;
    marketing;
    personalization;
    acceptedAt;
}
__decorate([
    IsString(),
    Length(1, 20),
    __metadata("design:type", String)
], ConsentsDto.prototype, "termsVersion", void 0);
__decorate([
    IsBoolean(),
    __metadata("design:type", Boolean)
], ConsentsDto.prototype, "marketing", void 0);
__decorate([
    IsBoolean(),
    __metadata("design:type", Boolean)
], ConsentsDto.prototype, "personalization", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ConsentsDto.prototype, "acceptedAt", void 0);
export class MachineTapDto {
    nfcId;
    action;
    amountCents;
    bottles;
}
__decorate([
    Matches(/^[a-f0-9]{32}$/, { message: 'Identificador do cartão inválido.' }),
    __metadata("design:type", String)
], MachineTapDto.prototype, "nfcId", void 0);
__decorate([
    IsIn(['spend', 'return']),
    __metadata("design:type", String)
], MachineTapDto.prototype, "action", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    Max(100_000),
    __metadata("design:type", Number)
], MachineTapDto.prototype, "amountCents", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    Max(50),
    __metadata("design:type", Number)
], MachineTapDto.prototype, "bottles", void 0);
//# sourceMappingURL=mobile.dto.js.map