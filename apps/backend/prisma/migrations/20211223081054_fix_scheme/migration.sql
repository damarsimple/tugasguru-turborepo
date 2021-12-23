/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `FileDocument` table. All the data in the column will be lost.
  - You are about to drop the column `contentUrl` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `pictureUrl` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `Packagequestion` table. All the data in the column will be lost.
  - You are about to drop the column `pictureUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `paymentUrl` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `fileId` to the `FileDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictureId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverId` to the `Packagequestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictureId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileDocument" DROP COLUMN "fileUrl",
ADD COLUMN     "fileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "contentUrl",
ADD COLUMN     "contentId" TEXT;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "pictureUrl",
ADD COLUMN     "pictureId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Packagequestion" DROP COLUMN "coverUrl",
ADD COLUMN     "coverId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "pictureUrl",
ADD COLUMN     "pictureId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "coverUrl",
ADD COLUMN     "coverId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "paymentUrl",
ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coverId" TEXT;
