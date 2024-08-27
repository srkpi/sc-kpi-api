/*
  Warnings:

  - Added the required column `type` to the `ServiceNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceNote" ADD COLUMN     "type" TEXT NOT NULL;
