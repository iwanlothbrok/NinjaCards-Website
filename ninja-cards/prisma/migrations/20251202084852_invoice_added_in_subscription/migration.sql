-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `stripeSubscriptionId` VARCHAR(191) NULL,
    ADD COLUMN `subscriptionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Invoice_stripeSubscriptionId_idx` ON `Invoice`(`stripeSubscriptionId`);

-- CreateIndex
CREATE INDEX `Invoice_subscriptionId_idx` ON `Invoice`(`subscriptionId`);

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
