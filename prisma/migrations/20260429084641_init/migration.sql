/*
  Warnings:

  - You are about to drop the column `contact` on the `Guardian` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Guardian` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `contact` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guardian" DROP COLUMN "contact",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "contact",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "contact",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contact" TEXT NOT NULL;
