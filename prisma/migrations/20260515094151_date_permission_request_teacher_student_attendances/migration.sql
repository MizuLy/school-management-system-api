/*
  Warnings:

  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_classId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- AlterTable
ALTER TABLE "PermissionRequest" ADD COLUMN     "date" DATE;

-- DropTable
DROP TABLE "Attendance";

-- CreateTable
CREATE TABLE "StudentAttendance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "StatusAttendance" NOT NULL DEFAULT 'PRESENT',
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherAttendance" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "StatusAttendance" NOT NULL DEFAULT 'PRESENT',
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherAttendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAttendance" ADD CONSTRAINT "TeacherAttendance_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
