/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Assignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "subjectId",
ADD COLUMN     "dueDate" DATE;
