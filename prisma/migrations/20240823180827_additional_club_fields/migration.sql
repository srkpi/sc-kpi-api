-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "buttonLink" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageDeleteHash" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shortDescription" TEXT NOT NULL DEFAULT '';
