/*
  Warnings:

  - You are about to drop the column `agendaId` on the `Examsession` table. All the data in the column will be lost.
  - You are about to drop the column `examId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId]` on the table `Consultation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tutoringId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Consultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_examId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Examsession" DROP COLUMN "agendaId";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "examId",
DROP COLUMN "quizId";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "identityNumber" DROP NOT NULL,
ALTER COLUMN "identityNumber" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "_QuestionToQuiz" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExamToQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToQuiz_AB_unique" ON "_QuestionToQuiz"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToQuiz_B_index" ON "_QuestionToQuiz"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExamToQuestion_AB_unique" ON "_ExamToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamToQuestion_B_index" ON "_ExamToQuestion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_roomId_key" ON "Consultation"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_tutoringId_key" ON "Room"("tutoringId");

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuiz" ADD FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuiz" ADD FOREIGN KEY ("B") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToQuestion" ADD FOREIGN KEY ("A") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToQuestion" ADD FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
