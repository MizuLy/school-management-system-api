const express = require("express");
const {
  addCourse,
  getCourses,
  updateCourse,
  removeCourse,
} = require("../controllers/course.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/", verifyToken, isAdmin, addCourse);
router.get("/", getCourses);
router.put("/:id", verifyToken, isAdmin, updateCourse);
router.delete("/:id", verifyToken, isAdmin, removeCourse);

module.exports = router;
