/*
  Warnings:

  - You are about to drop the column `Genre` on the `Book` table. All the data in the column will be lost.
  - You are about to alter the column `Published` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Book` DROP COLUMN `Genre`,
    MODIFY `Published` DATETIME NULL;

-- CreateTable
CREATE TABLE `Genere` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Genere_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookToGenere` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BookToGenere_AB_unique`(`A`, `B`),
    INDEX `_BookToGenere_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BookToGenere` ADD CONSTRAINT `_BookToGenere_A_fkey` FOREIGN KEY (`A`) REFERENCES `Book`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookToGenere` ADD CONSTRAINT `_BookToGenere_B_fkey` FOREIGN KEY (`B`) REFERENCES `Genere`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
