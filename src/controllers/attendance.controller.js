const addAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
