-- CreateTable
CREATE TABLE `DashboardEvent` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DashboardEvent_userId_timestamp_idx`(`userId`, `timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DashboardEvent` ADD CONSTRAINT `DashboardEvent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Dashboard`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
