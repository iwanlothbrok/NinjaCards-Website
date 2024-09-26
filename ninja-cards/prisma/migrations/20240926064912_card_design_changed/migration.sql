-- AlterTable
ALTER TABLE `CardDesign` ADD COLUMN `courierAddress` LONGTEXT NULL,
    ADD COLUMN `courierIsSpeedy` BOOLEAN NOT NULL DEFAULT false;
