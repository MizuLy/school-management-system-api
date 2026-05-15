const { prisma } = require("../config/db");

const addSubmit = async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { assignmentId } = req.body;
    const studentId = req.user.student.id;

    // Check if assignment exist
    const assignmentResult = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignmentResult)
      return res.status(404).json({ error: "Assignment not found" });

    // Check if passed due Date
    if (assignmentResult.dueDate && new Date() > assignmentResult.dueDate) {
      return res.status(400).json({ error: "Assignment deadline has passed" });
    }

    // Submit
    const submit = await prisma.submission.create({
      data: { studentId, assignmentId, fileUrl },
    });

    res
      .status(201)
      .json({ status: "success", message: "Submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSubmit = async (req, res) => {
  try {
    const result = await prisma.submission.findMany({
      include: {
        student: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: result.map((r) => ({
        id: r.id,
        studentId: r.studentId,
        name: r.student.user.name,
        assignmentId: r.assignmentId,
        fileUrl: r.fileUrl ?? null,
        submittedAt: r.submittedAt,
        updatedAt: r.updatedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSubmit = async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null; // Editable file

    const submitResult = await prisma.submission.findUnique({
      where: { id: req.params.id },
    });

    if (!submitResult) return res.status(404).json({ error: "Not found" });

    if (submitResult.studentId !== req.user.student.id)
      return res.status(403).json({ error: "Not authorized" });

    const submitUpdateData = {};
    if (fileUrl !== null) submitUpdateData.fileUrl = fileUrl;

    const result = await prisma.submission.update({
      where: { id: req.params.id },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      data: submitUpdateData,
    });

    res.status(200).json({
      status: "success",
      data: {
        id: result.id,
        studentId: result.studentId,
        name: result.student.user.name,
        assignmentId: result.assignmentId,
        fileUrl: result.fileUrl ?? null,
        submittedAt: result.submittedAt,
        updatedAt: result.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeSubmit = async (req, res) => {
  try {
    const submitResult = await prisma.submission.findUnique({
      where: { id: req.params.id },
    });

    if (!submitResult) return res.status(404).json({ error: "Not found" });

    if (submitResult.studentId !== req.user.student.id)
      return res.status(403).json({ error: "Not authorized" });

    await prisma.submission.delete({
      where: { id: submitResult.id },
    });

    res.status(200).json({ status: "success", message: "Removed submission" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addSubmit, getSubmit, updateSubmit, removeSubmit };
