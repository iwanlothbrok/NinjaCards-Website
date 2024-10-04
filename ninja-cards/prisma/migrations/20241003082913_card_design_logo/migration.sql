-- AlterTable
ALTER TABLE `CardDesign` ADD COLUMN `backLogoUrl` LONGTEXT NULL,
    MODIFY `courierAddress` VARCHAR(191) NULL,
    MODIFY `courierIsSpeedy` INTEGER NOT NULL;
