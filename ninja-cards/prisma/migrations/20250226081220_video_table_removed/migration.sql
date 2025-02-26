/*
  Warnings:

  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_userId_fkey`;

-- DropTable
DROP TABLE `Video`;
