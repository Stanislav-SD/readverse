/*
  Warnings:

  - You are about to alter the column `Published` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Book` ADD COLUMN `Description` TEXT NULL,
    ADD COLUMN `ISBN10` VARCHAR(255) NULL,
    ADD COLUMN `ISBN13` VARCHAR(255) NULL,
    MODIFY `Published` DATETIME NULL,
    MODIFY `Pages` INTEGER NULL DEFAULT 1;
