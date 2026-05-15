const { prisma } = require("../config/db");

const addStudentAttendance = async (req, res) => {
  try {
    const { studentId, classId, date, status } = req.body;

    const result = await prisma.studentAttendance.create({
      data: { studentId, classId, date: new Date(date), status },
    });

    res.status(201).json({
      status: "success",
      message: "Attendance marked",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStudentAttendances = async (req, res) => {
  try {
    const attendances = await prisma.studentAttendance.findMany({
      include: {
        student: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: attendances.map((a) => ({
        id: a.id,
        classId: a.classId,
        studentId: a.studentId,
        name: a.student.user.name,
        date: a.date,
        status: a.status,
        confirmAt: a.confirmedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStudentAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    const attendanceResult = await prisma.studentAttendance.findUnique({
      where: { id: req.params.id },
    });

    if (!attendanceResult) return res.status(404).json({ error: "Not found" });

    if (!status) return res.status(400).json({ error: "Status is required" });

    const allowedStatus = ["PRESENT", "ABSENT", "LATE", "PERMISSION"];

    if (!allowedStatus.includes(status.toUpperCase())) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    const attendanceUpdateData = {};
    if (status !== undefined)
      attendanceUpdateData.status = status.toUpperCase();

    const result = await prisma.studentAttendance.update({
      where: { id: attendanceResult.id },
      data: attendanceUpdateData,
    });

    res.status(200).json({
      status: "success",
      message: `Attendance set to ${result.status.toLowerCase()}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addStudentAttendance,
  getStudentAttendances,
  updateStudentAttendance,
};
