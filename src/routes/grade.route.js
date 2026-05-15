const express = require("express");
const {
  addGrade,
  getGrades,
  updateGrade,
  removeGrade,
} = require("../controllers/grade.controller");
const verifyToken = require("../middlewares/verifyToken");
const isTeacher = require("../middlewares/isTeacher");

const router = express.Router();

router.post("/", verifyToken, isTeacher, addGrade);
router.get("/", verifyToken, getGrades);
router.put("/:id", verifyToken, isTeacher, updateGrade);
router.delete("/:id", verifyToken, isTeacher, removeGrade);

module.exports = router;
