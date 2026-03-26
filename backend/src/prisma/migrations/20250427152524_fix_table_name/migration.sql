/*
  Warnings:

  - You are about to alter the column `Published` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The primary key for the `Genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Genre` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Genre` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Name]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Id` to the `Genre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_BookToGenre` DROP FOREIGN KEY `_BookToGenre_B_fkey`;

-- DropIndex
DROP INDEX `Genre_name_key` ON `Genre`;

-- AlterTable
ALTER TABLE `Book` MODIFY `Published` DATETIME NULL;

-- AlterTable
ALTER TABLE `Genre` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `Name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- CreateIndex
CREATE UNIQUE INDEX `Genre_Name_key` ON `Genre`(`Name`);

-- AddForeignKey
ALTER TABLE `_BookToGenre` ADD CONSTRAINT `_BookToGenre_B_fkey` FOREIGN KEY (`B`) REFERENCES `Genre`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
