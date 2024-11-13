-- DropForeignKey
ALTER TABLE `produto` DROP FOREIGN KEY `Produto_proprietarioId_fkey`;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_proprietarioId_fkey` FOREIGN KEY (`proprietarioId`) REFERENCES `Proprietario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
