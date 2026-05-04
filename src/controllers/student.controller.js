const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");

const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
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
      data: students.map((student) => ({
        studentId: student.id,
        guardianId: student.guardianId,
        id: student.user.id,
        name: student.user.name,
        email: student.user.email,
        contact: student.user.contact,
        role: student.user.role,
        image: student.imageUrl,
        gender: student.gender,
        dob: student.dob,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { name, email, contact, password, dob, gender, guardianId } =
      req.body;

    const studentResult = await prisma.student.findUnique({
      where: { id: req.params.id },
    });

    if (!studentResult) return res.status(404).json({ error: "Not found" });

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

    const studentUpdateData = {};
    if (guardianId !== undefined) studentUpdateData.guardianId = guardianId;
    if (imageUrl != null) studentUpdateData.imageUrl = imageUrl;
    if (gender !== undefined) studentUpdateData.gender = gender;
    if (dob !== undefined) studentUpdateData.dob = dob;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: studentResult.userId }, // In studentResult find ID on Student Table which has userId
        data: userUpdateData,
      });

      const student = await tx.student.update({
        where: { id: req.params.id }, // Student's id
        data: studentUpdateData,
      });

      return { user, student };
    });

    res.status(200).json({
      status: "success",
      data: {
        guardianId: result.student.guardianId,
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        contact: result.user.contact,
        image: result.student.imageUrl,
        gender: result.student.gender,
        dob: result.student.dob,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeStudent = async (req, res) => {
  try {
    const studentResult = await prisma.student.findUnique({
      where: { id: req.params.id },
    });

    if (!studentResult) return res.status(404).json({ message: "Not found" });

    await prisma.user.delete({
      where: { id: studentResult.userId },
    });

    res.status(200).json({ status: "success", message: "Removed student" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStudents, updateStudent, removeStudent };
