const { prisma } = require("../config/db");

const addGrade = async (req, res) => {
  try {
    const { submissionId, score } = req.body;

    // check submission exists
    const submissionResult = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!submissionResult)
      return res.status(404).json({ error: "Submission not found" });
    if (submissionResult.assignment.class.teacherId !== req.user.teacher.id)
      return res.status(403).json({ error: "Not authorized" });

    // check not already graded
    const isGraded = await prisma.grade.findUnique({
      where: { submissionId },
    });
    if (isGraded)
      return res.status(409).json({ error: "Submission already graded" });

    const grade = await prisma.grade.create({
      data: {
        submissionId,
        score,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Grade added",
      data: {
        id: grade.id,
        submissionId: grade.submissionId,
        score: grade.score,
        recordedAt: grade.recordedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGrades = async (req, res) => {
  try {
    let where = {};

    if (req.user.role === "ADMIN") {
      where = {}; // all grades
    } else if (req.user.role === "TEACHER") {
      where = {
        submission: {
          assignment: { class: { teacherId: req.user.teacher.id } },
        },
      };
    } else if (req.user.role === "STUDENT") {
      where = { submission: { studentId: req.user.student.id } };
    }

    const [grades, aggregate] = await Promise.all([
      prisma.grade.findMany({ where }),
      prisma.grade.aggregate({
        where,
        _avg: { score: true },
        _sum: { score: true },
        _count: true,
      }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        grades,
        total: aggregate._sum.score,
        average: aggregate._avg.score,
        count: aggregate._count,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGrade = async (req, res) => {
  try {
    const { score } = req.body;

    const gradeResult = await prisma.grade.findUnique({
      where: { id: req.params.id },
      include: {
        submission: {
          include: {
            assignment: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });

    if (!gradeResult) return res.status(404).json({ error: "Not found" });
    if (
      gradeResult.submission.assignment.class.teacherId !== req.user.teacher.id
    )
      return res.status(403).json({ error: "Not authorized" });

    const gradeUpdateData = {};

    // if (submissionId !== undefined) gradeUpdateData.submissionId = submissionId;
    if (score !== undefined) gradeUpdateData.score = score;

    const result = await prisma.grade.update({
      where: { id: gradeResult.id },
      data: { score },
    });

    res.status(200).json({ status: "success", message: "Score updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeGrade = async (req, res) => {
  try {
    const gradeResult = await prisma.grade.findUnique({
      where: { id: req.params.id },
      include: {
        submission: {
          include: {
            assignment: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });

    if (!gradeResult) return res.status(404).json({ error: "Not found" });
    if (
      gradeResult.submission.assignment.class.teacherId !== req.user.teacher.id
    )
      return res.status(403).json({ error: "Not authorized" });

    await prisma.grade.delete({
      where: { id: gradeResult.id },
    });

    res.status(200).json({ status: "success", message: "Grade removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addGrade, getGrades, updateGrade, removeGrade };
