-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_agendaId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_classroomId_fkey";

-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "classroomId" DROP NOT NULL,
ALTER COLUMN "agendaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE SET NULL ON UPDATE CASCADE;
