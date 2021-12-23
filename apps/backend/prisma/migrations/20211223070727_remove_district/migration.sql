/*
  Warnings:

  - You are about to drop the column `districtId` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `districtId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `District` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_cityId_fkey";

-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_districtId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_districtId_fkey";

-- AlterTable
ALTER TABLE "School" DROP COLUMN "districtId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "districtId";

-- DropTable
DROP TABLE "District";
