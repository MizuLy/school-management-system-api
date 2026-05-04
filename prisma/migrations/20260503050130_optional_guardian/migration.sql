-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_guardianId_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "guardianId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Guardian"("id") ON DELETE SET NULL ON UPDATE CASCADE;
