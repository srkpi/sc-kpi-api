-- AlterTable
ALTER TABLE "ClubProject" ADD COLUMN     "imageDeleteHash" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "imageDeleteHash" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "DepartmentProject" ADD COLUMN     "imageDeleteHash" TEXT NOT NULL DEFAULT '';
