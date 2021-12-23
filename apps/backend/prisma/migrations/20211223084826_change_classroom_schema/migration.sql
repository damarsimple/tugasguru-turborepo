/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "paymentId",
ADD COLUMN     "paymentUrl" TEXT;

-- CreateTable
CREATE TABLE "_students" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_students_AB_unique" ON "_students"("A", "B");

-- CreateIndex
CREATE INDEX "_students_B_index" ON "_students"("B");

-- AddForeignKey
ALTER TABLE "_students" ADD FOREIGN KEY ("A") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_students" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
