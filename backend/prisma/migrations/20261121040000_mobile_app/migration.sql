-- App iOS: clientes por celular, sessões, SMS, saldo (ledger), consentimentos LGPD e máquinas.

CREATE TABLE `mobile_customers` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `name` VARCHAR(120) NULL,
    `cardNfcId` CHAR(32) NOT NULL,
    `passSerial` CHAR(32) NOT NULL,
    `foundersNumber` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `mobile_customers_phone_key`(`phone`),
    UNIQUE INDEX `mobile_customers_cardNfcId_key`(`cardNfcId`),
    UNIQUE INDEX `mobile_customers_passSerial_key`(`passSerial`),
    UNIQUE INDEX `mobile_customers_foundersNumber_key`(`foundersNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `mobile_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` CHAR(64) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `mobile_sessions_tokenHash_key`(`tokenHash`),
    INDEX `mobile_sessions_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `sms_challenges` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `codeHash` CHAR(64) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `sms_challenges_phone_createdAt_idx`(`phone`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `wallet_ledger` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `kind` ENUM('CASHBACK', 'BOTTLE_RETURN', 'SPEND', 'ADJUSTMENT') NOT NULL,
    `amountCents` INTEGER NOT NULL,
    `description` VARCHAR(160) NOT NULL,
    `machineId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `wallet_ledger_customerId_createdAt_idx`(`customerId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `mobile_consents` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `termsVersion` VARCHAR(20) NOT NULL,
    `marketing` BOOLEAN NOT NULL DEFAULT false,
    `personalization` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `mobile_consents_customerId_createdAt_idx`(`customerId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `machines` (
    `id` VARCHAR(40) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `status` ENUM('OPEN', 'CLOSED', 'MAINTENANCE') NOT NULL DEFAULT 'OPEN',
    `hours` VARCHAR(40) NOT NULL,
    `hasJuice` BOOLEAN NOT NULL DEFAULT true,
    `acceptsReturns` BOOLEAN NOT NULL DEFAULT true,
    `bottlesAvailable` INTEGER NOT NULL DEFAULT 0,
    `apiKeyHash` CHAR(64) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `mobile_sessions` ADD CONSTRAINT `mobile_sessions_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `mobile_customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `wallet_ledger` ADD CONSTRAINT `wallet_ledger_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `mobile_customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `mobile_consents` ADD CONSTRAINT `mobile_consents_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `mobile_customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
