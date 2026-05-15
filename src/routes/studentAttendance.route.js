const express = require("express");
const {
  addStudentAttendance,
  getStudentAttendances,
  updateStudentAttendance,
} = require("../controllers/studentAttendance.controller");
const verifyToken = require("../middlewares/verifyToken");
const isTeacher = require("../middlewares/isTeacher");

const router = express.Router();

router.post("/", verifyToken, isTeacher, addStudentAttendance);
router.get("/", verifyToken, getStudentAttendances);
router.put("/:id", verifyToken, isTeacher, updateStudentAttendance);

module.exports = router;
