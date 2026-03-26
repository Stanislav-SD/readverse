/*
  Warnings:

  - You are about to alter the column `Published` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `UserId` to the `ReadingSessionStat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Book` MODIFY `Published` DATETIME NULL;

-- AlterTable
ALTER TABLE `ReadingSessionStat` ADD COLUMN `UserId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ReadingSessionStat` ADD CONSTRAINT `ReadingSessionStat_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
