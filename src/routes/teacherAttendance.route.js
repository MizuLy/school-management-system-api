const express = require("express");
const {
  addTeacherAttendance,
  getTeacherAttendances,
  updateTeacherAttendance,
} = require("../controllers/teacherAttendance.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/", verifyToken, isAdmin, addTeacherAttendance);
router.get("/", verifyToken, getTeacherAttendances);
router.put("/:id", verifyToken, isAdmin, updateTeacherAttendance);

module.exports = router;
