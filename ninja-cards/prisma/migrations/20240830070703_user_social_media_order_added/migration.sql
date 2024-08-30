/*
  Warnings:

  - You are about to drop the column `cv` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `cv`,
    ADD COLUMN `socialMediaOrder` JSON NULL;
