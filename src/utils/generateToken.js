const jwt = require("jsonwebtoken");

const generateToken = async (userId, res) => {
  const payload = { id: userId }; // data embed inside JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 7 * 60 * 60 * 24,
  });
  return token;
};

module.exports = generateToken;
