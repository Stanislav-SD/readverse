/*
  Warnings:

  - You are about to alter the column `Published` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `Genere` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookToGenere` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_BookToGenere` DROP FOREIGN KEY `_BookToGenere_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BookToGenere` DROP FOREIGN KEY `_BookToGenere_B_fkey`;

-- AlterTable
ALTER TABLE `Book` MODIFY `Published` DATETIME NULL;

-- DropTable
DROP TABLE `Genere`;

-- DropTable
DROP TABLE `_BookToGenere`;

-- CreateTable
CREATE TABLE `Genre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Genre_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookToGenre` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BookToGenre_AB_unique`(`A`, `B`),
    INDEX `_BookToGenre_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BookToGenre` ADD CONSTRAINT `_BookToGenre_A_fkey` FOREIGN KEY (`A`) REFERENCES `Book`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookToGenre` ADD CONSTRAINT `_BookToGenre_B_fkey` FOREIGN KEY (`B`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
