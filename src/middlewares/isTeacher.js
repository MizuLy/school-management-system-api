const isTeacher = (req, res, next) => {
  if (req.user.role !== "TEACHER") {
    return res.status(403).json({ error: "Access denied" });
  }
};

module.exports = isTeacher;
