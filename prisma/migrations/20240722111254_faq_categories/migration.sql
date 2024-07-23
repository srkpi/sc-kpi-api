/*
  Warnings:

  - You are about to drop the column `category` on the `Faq` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Faq" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER;

-- CreateTable
CREATE TABLE "FaqCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FaqCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FaqCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
