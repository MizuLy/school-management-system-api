const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    const isExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (isExist)
      return res.status(400).json({ error: "Email already existed" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        contact,
        role: "ADMIN",
        password: hashedPassword,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: name,
          email: email,
          role: user.role,
          contact: contact,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user === null)
      return res.status(404).json({ error: "User doesn't exist" });
    if (user === false)
      return res.status(400).json({ error: "Invalid user or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = await generateToken(user.id, res);

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: email,
          role: user.role,
          contact: user.contact,
        },
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ status: "success", message: "Logged out success" });
};

const current = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, contact: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, logout, current };
