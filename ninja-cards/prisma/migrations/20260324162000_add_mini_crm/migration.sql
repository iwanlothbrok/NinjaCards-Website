ALTER TABLE `Subscribed`
    ADD COLUMN `source` VARCHAR(191) NULL DEFAULT 'profile',
    ADD COLUMN `sourceDetail` VARCHAR(191) NULL,
    ADD COLUMN `tapsBeforeLead` INTEGER NOT NULL DEFAULT 1;

CREATE TABLE `CRMDeal` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `stage` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'WON', 'LOST') NOT NULL DEFAULT 'NEW',
    `value` DOUBLE NULL,
    `source` VARCHAR(191) NULL,
    `sourceDetail` VARCHAR(191) NULL,
    `taps` INTEGER NOT NULL DEFAULT 0,
    `leadCapturedAt` DATETIME(3) NULL,
    `contactedAt` DATETIME(3) NULL,
    `meetingAt` DATETIME(3) NULL,
    `closedAt` DATETIME(3) NULL,
    `nextReminderAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `CRMDeal_leadId_key`(`leadId`),
    INDEX `CRMDeal_userId_stage_idx`(`userId`, `stage`),
    INDEX `CRMDeal_nextReminderAt_idx`(`nextReminderAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CRMNote` (
    `id` VARCHAR(191) NOT NULL,
    `dealId` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    INDEX `CRMNote_dealId_createdAt_idx`(`dealId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CRMTask` (
    `id` VARCHAR(191) NOT NULL,
    `dealId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `dueAt` DATETIME(3) NULL,
    `reminderAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    INDEX `CRMTask_dealId_completed_idx`(`dealId`, `completed`),
    INDEX `CRMTask_reminderAt_idx`(`reminderAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `CRMDeal`
    ADD CONSTRAINT `CRMDeal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT `CRMDeal_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Subscribed`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `CRMNote`
    ADD CONSTRAINT `CRMNote_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `CRMDeal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `CRMTask`
    ADD CONSTRAINT `CRMTask_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `CRMDeal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
