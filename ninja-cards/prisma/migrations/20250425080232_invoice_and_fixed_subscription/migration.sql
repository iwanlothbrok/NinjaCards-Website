/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodEnd` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscription_id]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subscriptionId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plan_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_user_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscription_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Subscription` DROP COLUMN `createdAt`,
    DROP COLUMN `currentPeriodEnd`,
    DROP COLUMN `plan`,
    DROP COLUMN `stripeCustomerId`,
    DROP COLUMN `stripeSubscriptionId`,
    ADD COLUMN `end_date` DATETIME(3) NULL,
    ADD COLUMN `plan_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `start_date` DATETIME(3) NOT NULL,
    ADD COLUMN `stripe_user_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `subscription_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `subscriptionId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `stripeId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `amountPaid` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `hostedInvoiceUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Invoice_stripeId_key`(`stripeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Subscription_subscription_id_key` ON `Subscription`(`subscription_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Subscription_userId_key` ON `Subscription`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_subscriptionId_key` ON `User`(`subscriptionId`);

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
