const { prisma } = require("../config/db");

const addCourse = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    const course = await prisma.course.create({
      data: {
        name,
        description,
        price,
        duration,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        id: course.id,
        name: course.name,
        description: course.description,
        price: course.price,
        duration: course.duration,
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
        price: c.price,
        duration: c.duration,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    const courseResult = await prisma.course.findUnique({
      where: { id: req.params.id },
    });

    if (!courseResult) return res.status(404).json({ error: "Not found" });

    const courseUpdateData = {};
    if (name !== undefined) courseUpdateData.name = name;
    if (description !== undefined) courseUpdateData.description = description;
    if (price !== undefined) courseUpdateData.price = price;
    if (duration !== undefined) courseUpdateData.duration = duration;

    const course = await prisma.course.update({
      where: { id: courseResult.id },
      data: courseUpdateData,
    });

    res.status(200).json({
      status: "success",
      data: {
        id: course.id,
        name: course.name,
        description: course.description,
        price: course.price,
        duration: course.duration,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeCourse = async (req, res) => {
  try {
    const courseResult = await prisma.course.findUnique({
      where: { id: req.params.id },
    });

    if (!courseResult) return res.status(404).json({ error: "Not found" });

    await prisma.course.delete({
      where: { id: courseResult.id },
    });

    res.status(200).json({ status: "success", message: "Course removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addCourse, getCourses, updateCourse, removeCourse };
