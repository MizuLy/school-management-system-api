const isStudent = (req, res, next) => {
  if (req.user.role !== "STUDENT") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

module.exports = isStudent;
