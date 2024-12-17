-- CreateTable
CREATE TABLE `Dashboard` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `profileVisits` INTEGER NOT NULL DEFAULT 0,
    `vcfDownloads` INTEGER NOT NULL DEFAULT 0,
    `profileShares` INTEGER NOT NULL DEFAULT 0,
    `socialLinkClicks` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Dashboard_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dashboard` ADD CONSTRAINT `Dashboard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
