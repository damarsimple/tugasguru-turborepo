-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "classtypeId" INTEGER;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_classtypeId_fkey" FOREIGN KEY ("classtypeId") REFERENCES "Classtype"("id") ON DELETE SET NULL ON UPDATE CASCADE;
