/*
  Warnings:

  - You are about to drop the column `UserId` on the `Book` table. All the data in the column will be lost.
  - You are about to alter the column `Published` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `Book` DROP FOREIGN KEY `Book_UserId_fkey`;

-- DropIndex
DROP INDEX `Book_UserId_fkey` ON `Book`;

-- AlterTable
ALTER TABLE `Book` DROP COLUMN `UserId`,
    MODIFY `Published` DATETIME NULL;
