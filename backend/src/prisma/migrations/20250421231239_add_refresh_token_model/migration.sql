/*
  Warnings:

  - You are about to alter the column `Published` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Book` MODIFY `Published` DATETIME NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `Role` ENUM('USER', 'LISTER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `RefreshTokens` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `Token` VARCHAR(191) NOT NULL,
    `DeviceId` VARCHAR(191) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ExpiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshTokens_UserId_DeviceId_key`(`UserId`, `DeviceId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshTokens` ADD CONSTRAINT `RefreshTokens_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
