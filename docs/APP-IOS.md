# App iOS da Orange ↔ API do site

O app iOS (SwiftUI, projeto `OrangeApp` no Mac do Enzo) fala com a API NestJS deste repositório nas rotas **`/api/mobile/*`**. Enquanto a API não está no ar, o app roda em **modo demonstração** (Perfil › Desenvolvedor).

## Esquema

```text
 iPhone (app Orange)                        Hostinger
 ┌───────────────────┐   HTTPS + Bearer   ┌──────────────────────────────┐
 │ Login SMS         │ ─────────────────▶ │ API NestJS  /api/mobile/*    │
 │ Saldo / extrato   │                    │  ├─ MobileAuthService (SMS)  │──▶ Twilio Verify
 │ Mapa das máquinas │                    │  ├─ MobileService (saldo)    │
 │ Planos / Founders │                    │  ├─ WalletPassService .pkpass│──▶ certificados Apple
 │ Privacidade LGPD  │                    │  └─ Prisma ─▶ MariaDB        │
 └─────────┬─────────┘                    └──────────────▲───────────────┘
           │ Apple Wallet (cartão Orange, NFC/VAS)       │ POST /machines/:id/tap
           ▼                                              │ (X-Machine-Key)
   ┌──────────────────┐   lê cardNfcId por NFC   ┌───────┴────────┐
   │ Cartão na Wallet │ ───────────────────────▶ │ Leitor da      │
   └──────────────────┘                          │ máquina Orange │
                                                 └────────────────┘
```

## Rotas

| Método | Rota | Uso |
|---|---|---|
| POST | `/api/mobile/auth/sms/start` | `{ phone: "+5561987654321" }` envia o código (5/min por IP) |
| POST | `/api/mobile/auth/sms/verify` | `{ phone, code }` → `{ token, user }` (400 errado, 410 vencido, 429 tentativas) |
| POST | `/api/mobile/auth/logout` | encerra a sessão |
| GET/PUT/DELETE | `/api/mobile/me` | dados, trocar nome, **excluir conta** (LGPD art. 18, App Store 5.1.1(v)) |
| PUT | `/api/mobile/me/consents` | grava consentimentos (histórico como prova) |
| POST | `/api/mobile/me/export` | cópia dos dados (LGPD art. 18 II/V) |
| GET | `/api/mobile/wallet` | saldo e extrato |
| GET | `/api/mobile/wallet/pass` | `.pkpass` do cartão Orange (501 até ter os certificados) |
| GET | `/api/mobile/founders` | vagas da Founders Edition (1.000) |
| GET | `/api/mobile/machines` | máquinas para o mapa |
| POST | `/api/mobile/machines/:id/tap` | **leitor da máquina**: `{ nfcId, action: "spend"|"return", amountCents?, bottles? }` |

Sessão do app: token aleatório de 32 bytes, guardado só como sha256 (`mobile_sessions`), válido ~6 meses; no iPhone fica no Keychain.

## O que falta e quem faz

| Item | Depende de | Como |
|---|---|---|
| SMS de verdade | Conta Twilio (Enzo) | Criar Verify Service, pôr `TWILIO_*` nas variáveis da API na Hostinger |
| Cartão na Wallet | Apple Developer Program US$ 99/ano (Enzo) | Criar Pass Type ID `pass.com.bebaorange.cartao`, gerar certificado, pedir **NFC Certificate** da Wallet à Apple, `npm i passkit-generator`, pôr `WALLET_*` |
| Leitor NFC na máquina | Hardware compatível com Apple VAS | Leitor certificado (ex.: VTAP100, ACR1252U com SDK VAS) chama `/machines/:id/tap` |
| Cobrança recorrente | Gateway (Asaas, Mercado Pago, Pagar.me) | Pix Automático + cartão; Apple Pay precisa de Merchant ID |
| Máquinas reais | Cadastro | Inserir na tabela `machines` (chave do leitor salva como sha256) |
| Textos legais | Advogado | Revisar `/termos` e `/privacidade` no site e os resumos no app; CNPJ e DPO reais |

## Regras de negócio implementadas

- Garrafa devolvida = **R$ 1,00** de saldo (`BOTTLE_CREDIT_CENTS`).
- Saldo = soma do `wallet_ledger` (entradas positivas, gastos negativos). Gasto maior que o saldo é recusado.
- Founders Edition: número 1–1000 atribuído na primeira assinatura paga (`claimFounders`), em transação.
- Sem QR: o cartão só é lido por NFC (decisão da marca).
