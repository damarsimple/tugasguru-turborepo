/*
  Warnings:

  - You are about to drop the `FileDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FileDocument" DROP CONSTRAINT "FileDocument_userId_fkey";

-- DropTable
DROP TABLE "FileDocument";

-- CreateTable
CREATE TABLE "FileData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "fileType" "FileType" NOT NULL,
    "referencePath" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetId" INTEGER,
    "targetType" TEXT,
    "context" TEXT,
    "originalSize" INTEGER NOT NULL DEFAULT 0,
    "compressedSize" INTEGER NOT NULL DEFAULT 0,
    "mime" TEXT NOT NULL,
    "compressMetadata" JSONB,
    "fileName" TEXT NOT NULL,
    "storage" "Storage" NOT NULL,

    CONSTRAINT "FileData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileData" ADD CONSTRAINT "FileData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
