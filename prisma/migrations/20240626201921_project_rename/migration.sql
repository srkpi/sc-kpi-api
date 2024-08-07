/*
  Warnings:

  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_clubId_fkey";

-- DropTable
DROP TABLE "Project";

-- CreateTable
CREATE TABLE "ClubProject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "ClubProject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClubProject" ADD CONSTRAINT "ClubProject_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
