const { prisma } = require("../config/db");

const addCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    const course = await prisma.course.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        id: course.id,
        name: course.name,
        description: course.description,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();

    res.status(200).json({
      status: "success",
      data: courses.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addCourse, getCourses };
