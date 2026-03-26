/*
  Warnings:

  - You are about to alter the column `Published` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Book` MODIFY `Published` DATETIME NULL;

-- CreateTable
CREATE TABLE `Rating` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `BookId` INTEGER NOT NULL,
    `Rating` DOUBLE NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Rating_BookId_UserId_key`(`BookId`, `UserId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_BookId_fkey` FOREIGN KEY (`BookId`) REFERENCES `Book`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
