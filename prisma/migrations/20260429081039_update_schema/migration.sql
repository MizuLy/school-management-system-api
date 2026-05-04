/*
  Warnings:

  - You are about to drop the column `gradeLevel` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `gradeLevel` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `gradeLevelId` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "gradeLevel",
ADD COLUMN     "gradeLevelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "gradeLevel",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "subject",
ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "GradeLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GradeLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevel_name_key" ON "GradeLevel"("name");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
