/*
  Warnings:

  - Added the required column `examtypeId` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "examtypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Examtype" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Examtype_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_examtypeId_fkey" FOREIGN KEY ("examtypeId") REFERENCES "Examtype"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
