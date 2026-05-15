const { prisma } = require("../config/db");

const addTeacherAttendance = async (req, res) => {
  try {
    const { teacherId, date, status } = req.body;

    const result = await prisma.teacherAttendance.create({
      data: { teacherId, date: new Date(date), status },
    });

    res.status(201).json({
      status: "success",
      message: "Attendance marked",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTeacherAttendances = async (req, res) => {
  try {
    const attendances = await prisma.teacherAttendance.findMany({
      include: {
        teacher: {
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
        teacherId: a.teacherId,
        name: a.teacher.user.name,
        date: a.date,
        status: a.status,
        confirmAt: a.confirmedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTeacherAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    const attendanceResult = await prisma.teacherAttendance.findUnique({
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

    const result = await prisma.teacherAttendance.update({
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
  addTeacherAttendance,
  getTeacherAttendances,
  updateTeacherAttendance,
};
