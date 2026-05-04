const bcrypt = require("bcrypt");
const { prisma } = require("../config/db");

const addGuardian = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    const isExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (isExist)
      return res.status(400).json({ error: "Email already existed" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          contact,
          role: "GUARDIAN",
        },
      });

      const guardian = await tx.guardian.create({
        data: {
          userId: user.id,
        },
      });

      return { user, guardian };
    });

    res
      .status(201)
      .json({ status: "success", message: "Guardian created", data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGuardians = async (req, res) => {
  try {
    const guardians = await prisma.guardian.findMany({
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
        students: {
          include: {
            user: {
              select: { id: true, name: true, email: true, contact: true },
            },
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: guardians.map((guardian) => ({
        guardianId: guardian.id,
        id: guardian.user.id,
        name: guardian.user.name,
        email: guardian.user.email,
        contact: guardian.user.contact,
        role: guardian.user.role,
        students: guardian.students.map((student) => ({
          studentId: student.id,
          name: student.user.name,
          email: student.user.email,
          contact: student.user.contact,
        })),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGuardian = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    const guardianResult = await prisma.guardian.findUnique({
      where: { id: req.params.id },
    });

    if (!guardianResult) return res.status(404).json({ error: "Not found" });

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

    const result = await prisma.user.update({
      where: { id: guardianResult.userId },
      data: userUpdateData,
    });

    res.status(200).json({
      status: "success",
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        contact: result.contact,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeGuardian = async (req, res) => {
  try {
    const guardianResult = await prisma.guardian.findUnique({
      where: { id: req.params.id },
    });

    if (!guardianResult) return res.status(404).json({ error: "Not found" });

    await prisma.user.delete({
      where: { id: guardianResult.userId },
    });

    res.status(200).json({ status: "success", message: "Guardian removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addGuardian, getGuardians, updateGuardian, removeGuardian };
