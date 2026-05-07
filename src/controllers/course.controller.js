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
  } catch (error) {}
};

module.exports = { addCourse };
