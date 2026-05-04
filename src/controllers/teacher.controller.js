const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");

// ADMIN create account for Teacher
const addTeacher = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { name, email, password, contact } = req.body;

    const isExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (isExist)
      return res.status(400).json({ error: "Email already existed" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // // Admin create account for teacher
    // const user = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //     role: "TEACHER", // Hard coded cuz ADMIN register for them
    //   },
    // });

    // // then create teacher linked to that user
    // const teacher = await prisma.teacher.create({
    //   data: {
    //     userId: user.id,
    //     imageUrl,
    //     contact,
    //   },
    // });

    const result = await prisma.$transaction(async (tx) => {
      // Using transaction: if Teacher creation fails, User creation is also rolled back
      // This prevents orphaned User records in the database
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "TEACHER",
          contact,
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          imageUrl,
        },
      });

      return { user, teacher };
    });

    res.status(201).json({
      status: "success",
      data: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        contact: result.user.contact,
        image: result.teacher.imageUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET
const getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            contact: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: teachers.map((teacher) => ({
        teacherId: teacher.id,
        id: teacher.user.id,
        name: teacher.user.name,
        email: teacher.user.email,
        contact: teacher.user.contact,
        role: teacher.user.role,
        image: teacher.imageUrl,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT
const updateTeacher = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { name, contact, email, password } = req.body;

    const teacherResult = await prisma.teacher.findUnique({
      where: { id: req.params.id },
    });

    if (!teacherResult) return res.status(404).json({ error: "Not found" });

    // Check if email already exist when tryna chnage
    if (email) {
      const isExist = await prisma.user.findUnique({ where: { email } });
      if (isExist)
        return res.status(400).json({ error: "Email already taken" });
    }

    const userUpdateData = {};
    if (name !== undefined) userUpdateData.name = name;
    if (email !== undefined) userUpdateData.email = email;
    if (password !== undefined)
      userUpdateData.password = await bcrypt.hash(password, 10);
    if (contact !== undefined) userUpdateData.contact = contact;

    const teacherUpdatedata = {};
    if (imageUrl != null) teacherUpdatedata.imageUrl = imageUrl;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: teacherResult.userId },
        data: userUpdateData,
      });
      const teacher = await tx.teacher.update({
        where: { id: req.params.id },
        data: teacherUpdatedata,
      });

      return { user, teacher };
    });

    res.status(200).json({
      status: "success",
      data: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        contact: result.user.contact,
        image: result.teacher.imageUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeTeacher = async (req, res) => {
  try {
    const teacherResult = await prisma.teacher.findUnique({
      where: { id: req.params.id },
    });

    if (!teacherResult) return res.status(404).json({ error: "Not found" });

    await prisma.user.delete({
      where: { id: teacherResult.userId },
    });

    res.status(200).json({ status: "Success", message: "Removed teacher" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addTeacher, getTeachers, updateTeacher, removeTeacher };
