-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_clubId_fkey";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
