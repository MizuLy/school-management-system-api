const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Generate token
const generateRegistrationToken = async (req, res) => {
  try {
    // Generate a random 32-byte hex string as the unique token
    const token = crypto.randomBytes(32).toString("hex");

    const registrationToken = await prisma.registrationToken.create({
      data: {
        token,
        generatedBy: req.user.id, // Admin who generated this token
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        token: registrationToken.token,
        url: `${process.env.FRONTEND_URL}/register?token=${registrationToken.token}`, // URL for QR generation on frontend
        expiresAt: registrationToken.expiresAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// For add student's QR
const registerQR = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { name, email, password, contact, gender, dob } = req.body;

    // =============================Token Validation==============================
    const { token } = req.params; // or req.query depending on your route

    const registrationToken = await prisma.registrationToken.findUnique({
      where: { token },
    });

    if (!registrationToken)
      return res.status(400).json({ error: "Invalid token" });

    if (registrationToken.usedAt)
      return res.status(400).json({ error: "Token already used" });

    if (registrationToken.expiresAt < new Date())
      return res.status(400).json({ error: "Token expired" });

    // ===========================================================================

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
          role: "STUDENT",
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          gender: gender.toUpperCase(),
          dob: new Date(dob),
          imageUrl,
        },
      });

      await tx.registrationToken.update({
        where: { token },
        data: { usedAt: new Date() },
      });

      return { user, student };
    });

    res.status(201).json({
      status: "success",
      data: {
        userId: result.user.id,
        id: result.student.id,
        name: result.user.name,
        email: result.user.email,
        contact: result.user.contact,
        gender: result.student.gender,
        dob: result.student.dob,
        image: result.student.imageUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateRegistrationToken, registerQR };
