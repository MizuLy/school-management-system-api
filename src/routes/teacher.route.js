const express = require("express");
const {
  addTeacher,
  getTeachers,
  updateTeacher,
  removeTeacher,
} = require("../controllers/teacher.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/", verifyToken, isAdmin, upload.single("imageUrl"), addTeacher);
router.get("/", verifyToken, getTeachers);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("imageUrl"),
  updateTeacher,
);
router.delete("/:id", verifyToken, isAdmin, removeTeacher);

module.exports = router;
