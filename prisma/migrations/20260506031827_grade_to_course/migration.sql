/*
  Warnings:

  - You are about to drop the column `gradeLevelId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the `GradeLevel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseId` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_gradeLevelId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "gradeLevelId",
ADD COLUMN     "courseId" TEXT NOT NULL,
ALTER COLUMN "teacherId" DROP NOT NULL;

-- DropTable
DROP TABLE "GradeLevel";

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
