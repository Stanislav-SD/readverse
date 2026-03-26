/*
  Warnings:

  - You are about to alter the column `Published` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Book` MODIFY `Published` DATETIME NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `LastActive` DATETIME(3) NULL,
    ADD COLUMN `Status` ENUM('ONLINE', 'OFFLINE', 'IDLE', 'DND') NOT NULL DEFAULT 'OFFLINE',
    ADD COLUMN `Visibility` ENUM('PUBLIC', 'INVISIBLE') NOT NULL DEFAULT 'PUBLIC';

-- CreateTable
CREATE TABLE `Friends` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `FriendId` INTEGER NOT NULL,
    `Status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_FriendId_fkey` FOREIGN KEY (`FriendId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
