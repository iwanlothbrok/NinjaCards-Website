/*
  Warnings:

  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Lead` DROP FOREIGN KEY `Lead_userId_fkey`;

-- DropTable
DROP TABLE `Lead`;

-- CreateTable
CREATE TABLE `Subscribed` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isAccepted` BOOLEAN NOT NULL DEFAULT true,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subscribed` ADD CONSTRAINT `Subscribed_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
