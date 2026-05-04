const express = require("express");
const {
  getStudents,
  updateStudent,
  removeStudent,
} = require("../controllers/student.controller");
const upload = require("../utils/multer");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/", verifyToken, getStudents);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("imageUrl"),
  updateStudent,
);
router.delete("/:id", verifyToken, isAdmin, removeStudent);

module.exports = router;
