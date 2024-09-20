/*
  Warnings:

  - You are about to drop the `Benefit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Benefit` DROP FOREIGN KEY `Benefit_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Feature` DROP FOREIGN KEY `Feature_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_productId_fkey`;

-- DropTable
DROP TABLE `Benefit`;

-- DropTable
DROP TABLE `Feature`;

-- DropTable
DROP TABLE `Product`;

-- DropTable
DROP TABLE `Review`;

-- DropTable
DROP TABLE `Test`;
