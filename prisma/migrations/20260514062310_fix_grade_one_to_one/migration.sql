/*
  Warnings:

  - You are about to drop the column `studentId` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `Grade` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[submissionId]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_studentId_fkey";

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "studentId",
DROP COLUMN "term",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Grade_submissionId_key" ON "Grade"("submissionId");
