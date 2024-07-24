/*
  Warnings:

  - Added the required column `imageDeleteHash` to the `ClubProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageDeleteHash` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageDeleteHash` to the `DepartmentProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClubProject" ADD COLUMN     "imageDeleteHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "imageDeleteHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DepartmentProject" ADD COLUMN     "imageDeleteHash" TEXT NOT NULL;
