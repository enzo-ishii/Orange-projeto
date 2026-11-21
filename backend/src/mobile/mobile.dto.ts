import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';

const E164_BR = /^\+55\d{10,11}$/;

export class SmsStartDto {
  @Matches(E164_BR, { message: 'Celular inválido.' })
  phone!: string;
}

export class SmsVerifyDto {
  @Matches(E164_BR, { message: 'Celular inválido.' })
  phone!: string;

  @Matches(/^\d{6}$/, { message: 'O código tem 6 dígitos.' })
  code!: string;
}

export class UpdateProfileDto {
  @IsString()
  @Length(1, 120)
  name!: string;
}

export class ConsentsDto {
  @IsString()
  @Length(1, 20)
  termsVersion!: string;

  @IsBoolean()
  marketing!: boolean;

  @IsBoolean()
  personalization!: boolean;

  @IsOptional()
  @IsString()
  acceptedAt?: string;
}

/** Chamado pelo leitor da máquina quando alguém encosta o cartão Orange. */
export class MachineTapDto {
  @Matches(/^[a-f0-9]{32}$/, { message: 'Identificador do cartão inválido.' })
  nfcId!: string;

  @IsIn(['spend', 'return'])
  action!: 'spend' | 'return';

  /** spend: valor em centavos a debitar do saldo */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100_000)
  amountCents?: number;

  /** return: quantidade de garrafas devolvidas */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  bottles?: number;
}

export class FirebaseLoginDto {
  @IsString()
  @Length(100, 4096)
  idToken!: string;
}
