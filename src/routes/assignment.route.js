const express = require("express");
const {
  addAssignment,
  getAssignments,
  updateAssignment,
  removeAssignment,
} = require("../controllers/assignment.controller");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../utils/multer");
const isTeacher = require("../middlewares/isTeacher");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  upload.single("fileUrl"),
  isTeacher,
  addAssignment,
);
router.get("/", verifyToken, getAssignments); // GET /api/assignments?classId=abc123
router.put(
  "/:id",
  verifyToken,
  upload.single("fileUrl"),
  isTeacher,
  updateAssignment,
);
router.delete("/:id", verifyToken, isTeacher, removeAssignment);

module.exports = router;
