const { prisma } = require("../config/db");

const addAssignment = async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { title, classId, description, dueDate } = req.body;

    // Validate if teacher is selecting their right class
    const classResult = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classResult) return res.status(404).json({ error: "Class not found" });
    if (classResult.teacherId !== req.user.teacher.id) {
      return res.status(403).json({ error: "Not your class" });
    }
    //====================================================

    const assignment = await prisma.assignment.create({
      data: {
        title,
        classId,
        description,
        fileUrl,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        title: assignment.title,
        classId: assignment.classId,
        description: assignment.description,
        fileUrl: assignment.fileUrl,
        dueDate: assignment.dueDate,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const results = await prisma.assignment.findMany({
      where: {
        classId: req.query.classId, // GET /api/assignments?classId=abc123
        class: {
          teacherId: req.user.teacher.id, // Filter class depend on teacher
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: results.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        fileUrl: r.fileUrl ?? null,
        dueDate: r.dueDate,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { title, classId, description, dueDate } = req.body;

    if (classId) {
      const classResult = await prisma.class.findUnique({
        where: { id: classId },
      });

      if (!classResult) return res.status(404).json({ error: "Not found" });
      if (classResult.teacherId !== req.user.teacher.id)
        return res.status(403).json({ error: "Not your class" });
    }

    const assignmentResult = await prisma.assignment.findUnique({
      where: { id: req.params.id },
    });

    if (!assignmentResult) return res.status(404).json({ error: "Not found" });

    const assignmentUpdatedata = {};
    if (title !== undefined) assignmentUpdatedata.title = title;
    if (classId !== undefined) assignmentUpdatedata.classId = classId;
    if (description !== undefined)
      assignmentUpdatedata.description = description;
    if (fileUrl !== null) assignmentUpdatedata.fileUrl = fileUrl;
    if (dueDate !== undefined) assignmentUpdatedata.dueDate = dueDate;

    const assignment = await prisma.assignment.update({
      where: { id: assignmentResult.id },
      data: assignmentUpdatedata,
    });

    res.status(200).json({
      status: "success",
      data: {
        title: assignment.title,
        classId: assignment.classId,
        description: assignment.description,
        fileUrl: assignment.fileUrl,
        dueDate: assignment.dueDate,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeAssignment = async (req, res) => {
  try {
    const assigmentResult = await prisma.assignment.findUnique({
      where: { id: req.params.id },
    });

    if (!assigmentResult) return res.status(404).json({ error: "Not found" });

    await prisma.assignment.delete({
      where: { id: assigmentResult.id },
    });

    res.status(200).json({ status: "success", message: "Assignment removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addAssignment,
  getAssignments,
  updateAssignment,
  removeAssignment,
};
