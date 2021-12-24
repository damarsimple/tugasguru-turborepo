-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FileType" ADD VALUE 'POWERPOINT';
ALTER TYPE "FileType" ADD VALUE 'TEXT';
ALTER TYPE "FileType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "FileData" ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;
