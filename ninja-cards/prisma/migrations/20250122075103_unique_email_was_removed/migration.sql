-- DropIndex
DROP INDEX `User_email_id_key` ON `User`;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `email` DROP DEFAULT;
