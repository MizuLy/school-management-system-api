const express = require("express");
const { addCourse } = require("../controllers/course.controller");

const router = express.Router();

router.post("/", addCourse);

module.exports = router;
