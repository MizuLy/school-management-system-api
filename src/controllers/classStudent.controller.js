const { prisma } = require("../config/db");

const enrollStudent = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    const enroll = await prisma.classStudent.create({
      include: {
        class: {
          include: {
            teacher: {
              include: {
                user: {
                  select: { name: true },
                },
              },
            },
          },
        },
        student: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      data: {
        studentId,
        classId,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        id: enroll.id,
        class: enroll.class.room,
        classId: enroll.classId,
        teacherName: enroll.class.teacher.user.name ?? null,
        studentId: enroll.studentId,
        studentName: enroll.student.user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getClassStudents = async (req, res) => {
  try {
    const result = await prisma.classStudent.findMany({
      include: {
        class: {
          include: {
            teacher: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
        student: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: result.map((r) => ({
        id: r.id,
        classId: r.classId,
        room: r.class.room,
        teacherName: r.class.teacher.user.name ?? null,
        studentId: r.studentId,
        studentName: r.student.user.name,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const unenrollStudent = async (req, res) => {
  try {
    const unenroll = await prisma.classStudent.findUnique({
      where: { id: req.params.id },
    });

    if (!unenroll) return res.status(404).json({ error: "Not found" });

    await prisma.classStudent.delete({
      where: { id: unenroll.id },
    });

    res.status(200).json({ status: "success", message: "Unenroll success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { enrollStudent, getClassStudents, unenrollStudent };
