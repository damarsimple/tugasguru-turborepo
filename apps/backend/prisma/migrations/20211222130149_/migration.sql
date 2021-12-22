/*
  Warnings:

  - The values [SCHOOL_ADMINISTRATOR] on the enum `AccessType` will be removed. If these variants are still used in the database, this will fail.
  - The values [LOCAL_CONTENT,SPECIAL_DEVELOPMENT] on the enum `SubjectType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `context_content` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `picture_url` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `picture_url` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `extra_content` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `payment_url` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `extra_content` on the `Withdraw` table. All the data in the column will be lost.
  - Added the required column `contextContent` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictureUrl` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictureUrl` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PDF', 'EXCEL', 'WORD', 'VIDEO', 'AUDIO', 'IMAGE');

-- CreateEnum
CREATE TYPE "QuizDifficulty" AS ENUM ('HARD', 'EASY', 'MEDIUM');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('SELECT', 'PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'SETTLED');

-- CreateEnum
CREATE TYPE "AgendaAbsentTargetStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MeetingContentType" AS ENUM ('YOUTUBE', 'WHITEBOARD', 'MEDIA');

-- CreateEnum
CREATE TYPE "Storage" AS ENUM ('LOCAL', 'CLOUD');

-- AlterEnum
BEGIN;
CREATE TYPE "AccessType_new" AS ENUM ('GOLD', 'SILVER', 'BRONZE', 'COUNSELOR', 'PLUS', 'HOMEROOM', 'SCHOOLADMINISTRATOR', 'HEADMASTER');
ALTER TABLE "UserAccess" ALTER COLUMN "type" TYPE "AccessType_new" USING ("type"::text::"AccessType_new");
ALTER TABLE "Course" ALTER COLUMN "access" TYPE "AccessType_new"[] USING ("access"::text::"AccessType_new"[]);
ALTER TYPE "AccessType" RENAME TO "AccessType_old";
ALTER TYPE "AccessType_new" RENAME TO "AccessType";
DROP TYPE "AccessType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SubjectType_new" AS ENUM ('GENERAL', 'VOCATIONAL', 'LOCALCONTENT', 'SPECIALDEVELOPMENT');
ALTER TABLE "Subject" ALTER COLUMN "type" TYPE "SubjectType_new" USING ("type"::text::"SubjectType_new");
ALTER TYPE "SubjectType" RENAME TO "SubjectType_old";
ALTER TYPE "SubjectType_new" RENAME TO "SubjectType";
DROP TYPE "SubjectType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "context_content",
DROP COLUMN "picture_url",
ADD COLUMN     "contextContent" TEXT NOT NULL,
ADD COLUMN     "pictureUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "picture_url",
ADD COLUMN     "pictureUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "meetingId" INTEGER,
ADD COLUMN     "tutoringId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "extra_content",
DROP COLUMN "payment_method",
DROP COLUMN "payment_url",
ADD COLUMN     "extraContent" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL,
ADD COLUMN     "paymentUrl" TEXT;

-- AlterTable
ALTER TABLE "Withdraw" DROP COLUMN "extra_content",
ADD COLUMN     "extraContent" TEXT;

-- CreateTable
CREATE TABLE "CourseVideo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "views" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "files" TEXT[],
    "filesType" "FileType"[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "classtypeId" INTEGER NOT NULL,
    "playedCount" INTEGER NOT NULL DEFAULT 0,
    "isRewarded" BOOLEAN NOT NULL DEFAULT false,
    "difficulty" "QuizDifficulty" NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT E'PUBLIC',
    "coverUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quizmatch" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "quizId" INTEGER NOT NULL,
    "password" TEXT,
    "startAt" TIMESTAMP(3),
    "finishAt" TIMESTAMP(3),
    "roomId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quizmatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quizplayer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "quizmatchId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "streak" INTEGER NOT NULL DEFAULT 1,
    "answersMap" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quizplayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "consultantId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'INACTIVE',
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Absent" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,

    CONSTRAINT "Absent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "agendaId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "absentId" INTEGER,
    "status" "AgendaAbsentTargetStatus" NOT NULL DEFAULT E'PENDING',
    "forDate" TIMESTAMP(3) NOT NULL,
    "isTutoring" BOOLEAN NOT NULL DEFAULT false,
    "tutoringIndex" INTEGER,
    "tutoringPaid" BOOLEAN NOT NULL DEFAULT false,
    "attendanceAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tutoringId" INTEGER,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subjectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "classroomId" INTEGER NOT NULL,
    "odd" BOOLEAN NOT NULL DEFAULT false,
    "hint" TEXT,
    "description" TEXT,
    "timeLimit" TEXT NOT NULL,
    "yearStart" INTEGER,
    "yearEnd" INTEGER,
    "shuffle" BOOLEAN NOT NULL DEFAULT true,
    "showResult" BOOLEAN NOT NULL DEFAULT true,
    "agendaId" INTEGER NOT NULL,
    "classtypeId" INTEGER,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Examsession" (
    "id" SERIAL NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "examId" INTEGER NOT NULL,
    "openAt" TIMESTAMP(3) NOT NULL,
    "closeAt" TIMESTAMP(3) NOT NULL,
    "agendaId" INTEGER NOT NULL,

    CONSTRAINT "Examsession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Examplay" (
    "id" SERIAL NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "examId" INTEGER,
    "examsessionId" INTEGER,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "timePassed" INTEGER NOT NULL,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishAt" TIMESTAMP(3),
    "grade" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "graded" BOOLEAN NOT NULL DEFAULT false,
    "answersMap" JSONB,

    CONSTRAINT "Examplay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "classroomId" INTEGER NOT NULL,
    "documents" TEXT[],
    "filesTypes" TEXT[],
    "contentType" "MeetingContentType" NOT NULL,
    "contentUrl" TEXT,
    "contentText" TEXT,
    "agendaId" INTEGER NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'ACTIVE',
    "roomId" INTEGER,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assigment" (
    "id" SERIAL NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "classroomId" INTEGER NOT NULL,
    "yearStart" INTEGER NOT NULL,
    "yearEnd" INTEGER NOT NULL,
    "closeAt" TIMESTAMP(3) NOT NULL,
    "files" TEXT[],
    "filesType" "FileType"[],
    "odd" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Assigment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssigmentSubmission" (
    "id" SERIAL NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigmentId" INTEGER NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "graded" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "files" TEXT[],
    "filesType" "FileType"[],
    "editedTimes" INTEGER NOT NULL DEFAULT 0,
    "turnedAt" TIMESTAMP(3) NOT NULL,
    "turned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AssigmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER,
    "examId" INTEGER,
    "content" TEXT NOT NULL,
    "files" TEXT[],
    "filesType" "FileType"[],
    "visibility" "Visibility" NOT NULL DEFAULT E'PUBLIC',
    "classtypeId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "answers" TEXT[],
    "answersDocuments" TEXT[],
    "answersTypes" TEXT[],
    "correctAnswerIndex" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Packagequestion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT E'PUBLIC',
    "classtypeId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Packagequestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileDocument" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "referencePath" TEXT,
    "fileType" "FileType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetId" INTEGER,
    "targetType" TEXT,
    "context" TEXT,
    "originalSize" INTEGER NOT NULL,
    "compressedSize" INTEGER NOT NULL,
    "extensions" TEXT NOT NULL,
    "compressMetadata" JSONB,
    "fileName" TEXT NOT NULL,
    "storage" "Storage" NOT NULL,

    CONSTRAINT "FileDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutoring" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "agendaId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'ACTIVE',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "startAt" TIMESTAMP(3) NOT NULL,
    "finishAt" TIMESTAMP(3) NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "rejectedReason" TEXT NOT NULL,
    "geolocation" JSONB,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Tutoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExamToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PackagequestionToQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tutoring_agendaId_key" ON "Tutoring"("agendaId");

-- CreateIndex
CREATE UNIQUE INDEX "_ExamToUser_AB_unique" ON "_ExamToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamToUser_B_index" ON "_ExamToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackagequestionToQuestion_AB_unique" ON "_PackagequestionToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_PackagequestionToQuestion_B_index" ON "_PackagequestionToQuestion"("B");

-- AddForeignKey
ALTER TABLE "CourseVideo" ADD CONSTRAINT "CourseVideo_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_tutoringId_fkey" FOREIGN KEY ("tutoringId") REFERENCES "Tutoring"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_classtypeId_fkey" FOREIGN KEY ("classtypeId") REFERENCES "Classtype"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizmatch" ADD CONSTRAINT "Quizmatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizmatch" ADD CONSTRAINT "Quizmatch_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizmatch" ADD CONSTRAINT "Quizmatch_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizplayer" ADD CONSTRAINT "Quizplayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizplayer" ADD CONSTRAINT "Quizplayer_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizplayer" ADD CONSTRAINT "Quizplayer_quizmatchId_fkey" FOREIGN KEY ("quizmatchId") REFERENCES "Quizmatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absent" ADD CONSTRAINT "Absent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absent" ADD CONSTRAINT "Absent_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_absentId_fkey" FOREIGN KEY ("absentId") REFERENCES "Absent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_tutoringId_fkey" FOREIGN KEY ("tutoringId") REFERENCES "Tutoring"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_classtypeId_fkey" FOREIGN KEY ("classtypeId") REFERENCES "Classtype"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examsession" ADD CONSTRAINT "Examsession_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examplay" ADD CONSTRAINT "Examplay_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examplay" ADD CONSTRAINT "Examplay_examsessionId_fkey" FOREIGN KEY ("examsessionId") REFERENCES "Examsession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examplay" ADD CONSTRAINT "Examplay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigment" ADD CONSTRAINT "Assigment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigment" ADD CONSTRAINT "Assigment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssigmentSubmission" ADD CONSTRAINT "AssigmentSubmission_assigmentId_fkey" FOREIGN KEY ("assigmentId") REFERENCES "Assigment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssigmentSubmission" ADD CONSTRAINT "AssigmentSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_classtypeId_fkey" FOREIGN KEY ("classtypeId") REFERENCES "Classtype"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packagequestion" ADD CONSTRAINT "Packagequestion_classtypeId_fkey" FOREIGN KEY ("classtypeId") REFERENCES "Classtype"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packagequestion" ADD CONSTRAINT "Packagequestion_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packagequestion" ADD CONSTRAINT "Packagequestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileDocument" ADD CONSTRAINT "FileDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutoring" ADD CONSTRAINT "Tutoring_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutoring" ADD CONSTRAINT "Tutoring_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutoring" ADD CONSTRAINT "Tutoring_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToUser" ADD FOREIGN KEY ("A") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackagequestionToQuestion" ADD FOREIGN KEY ("A") REFERENCES "Packagequestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackagequestionToQuestion" ADD FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
