-- CreateTable
CREATE TABLE `CardDesign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cardName` VARCHAR(191) NOT NULL,
    `cardTitle` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userPhone` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `frontDataUrl` VARCHAR(191) NOT NULL,
    `backDataUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
