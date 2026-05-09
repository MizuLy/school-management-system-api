const { prisma } = require("../config/db");

const addClass = async (req, res) => {
  try {
    const { room, schedule, courseId, teacherId } = req.body;

    const result = await prisma.class.create({
      include: {
        teacher: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        course: {
          select: { name: true },
        },
      },
      data: {
        room,
        schedule,
        courseId,
        teacherId,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Class created",
      data: {
        id: result.id, // room id
        courseId: result.courseId,
        courseName: result.course?.name,
        teacherId: result.teacherId,
        teacherName: result.teacher?.user.name ?? null,
        room: result.room, // room number
        schedule: result.schedule, // schedule of class
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        teacher: {
          //  no need to include teacher's id cuz id is already linked (FK-foreign key)
          //  but if u need name or anything else u must select true
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        course: {
          select: { name: true },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: classes.map((c) => ({
        id: c.id,
        teacherId: c.teacherId,
        courseId: c.courseId,
        courseName: c.course?.name,
        teacherName: c.teacher?.user.name ?? null,
        room: c.room,
        schedule: c.schedule,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const { room, schedule, courseId, teacherId } = req.body;

    const classResult = await prisma.class.findUnique({
      where: { id: req.params.id },
    });

    if (!classResult) return res.status(404).json({ error: "Not found" });

    const classUpdateData = {};
    if (room !== undefined) classUpdateData.room = room;
    if (schedule !== undefined) classUpdateData.schedule = schedule;
    if (courseId !== undefined) classUpdateData.courseId = courseId;
    if (teacherId !== undefined) classUpdateData.teacherId = teacherId;

    const result = await prisma.class.update({
      where: { id: classResult.id },
      data: classUpdateData,
      include: {
        teacher: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        course: {
          select: { name: true },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        id: result.id,
        teacherId: result.teacherId,
        courseId: result.courseId,
        courseName: result.course?.name,
        teacherName: result.teacher?.user.name ?? null,
        room: result.room,
        schedule: result.schedule,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeClass = async (req, res) => {
  try {
    const classResult = await prisma.class.findUnique({
      where: { id: req.params.id },
    });

    if (!classResult) return res.status(404).json({ error: "Not found" });

    await prisma.class.delete({
      where: { id: classResult.id },
    });

    res.status(200).json({ status: "success", message: "Class removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addClass, getClasses, updateClass, removeClass };
