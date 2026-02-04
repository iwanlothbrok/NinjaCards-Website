/*
  Warnings:

  - You are about to drop the column `plan_id` on the `Subscription` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Subscription` DROP COLUMN `plan_id`,
    MODIFY `status` ENUM('active', 'trialing', 'past_due', 'unpaid', 'paused', 'cancelled') NOT NULL;
