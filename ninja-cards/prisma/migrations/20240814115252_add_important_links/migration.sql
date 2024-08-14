/*
  Warnings:

  - You are about to drop the column `website1` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `website2` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `website1`,
    DROP COLUMN `website2`,
    ADD COLUMN `facebook` VARCHAR(191) NULL,
    ADD COLUMN `googleReview` VARCHAR(191) NULL,
    ADD COLUMN `instagram` VARCHAR(191) NULL,
    ADD COLUMN `linkedin` VARCHAR(191) NULL,
    ADD COLUMN `qrCode` VARCHAR(191) NULL,
    ADD COLUMN `revolut` VARCHAR(191) NULL,
    ADD COLUMN `tiktok` VARCHAR(191) NULL,
    ADD COLUMN `twitter` VARCHAR(191) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;
