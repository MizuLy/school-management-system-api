const { prisma } = require("../config/db");

const addClass = async (req, res) => {
  try {
    const { room, schedule, courseId, teacherId } = req.body;

    const result = await prisma.class.create({
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
        teacherId: result.teacherId,
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
      },
    });

    res.status(200).json({
      status: "success",
      data: classes.map((c) => ({
        id: c.id,
        teacherId: c.teacherId,
        teacherName: c.teacher?.user.name,
        room: c.room,
        schedule: c.schedule,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addClass, getClasses };
