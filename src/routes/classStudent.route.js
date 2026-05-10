const express = require("express");
const {
  enrollStudent,
  getClassStudents,
  unenrollStudent,
} = require("../controllers/classStudent.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/", verifyToken, isAdmin, enrollStudent);
router.get("/", getClassStudents);
router.delete("/:id", verifyToken, isAdmin, unenrollStudent);

module.exports = router;
