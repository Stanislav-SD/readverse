/*
  Warnings:

  - You are about to alter the column `Published` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Book` MODIFY `Published` DATETIME NULL;

-- CreateTable
CREATE TABLE `Badges` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Image` VARCHAR(255) NOT NULL,
    `Label` VARCHAR(255) NOT NULL,
    `Quest` VARCHAR(255) NOT NULL,
    `Conditions` JSON NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserBadges` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `BadgeId` INTEGER NOT NULL,
    `EarnedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserBadges_UserId_BadgeId_key`(`UserId`, `BadgeId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserBadges` ADD CONSTRAINT `UserBadges_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBadges` ADD CONSTRAINT `UserBadges_BadgeId_fkey` FOREIGN KEY (`BadgeId`) REFERENCES `Badges`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
