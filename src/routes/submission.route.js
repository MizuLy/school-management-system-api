const express = require("express");
const {
  addSubmit,
  getSubmit,
  updateSubmit,
  removeSubmit,
} = require("../controllers/submission.controller");
const isStudent = require("../middlewares/isStudent");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/", verifyToken, isStudent, upload.single("fileUrl"), addSubmit);
router.get("/", verifyToken, getSubmit);
router.put(
  "/:id",
  verifyToken,
  isStudent,
  upload.single("fileUrl"),
  updateSubmit,
);
router.delete("/:id", verifyToken, removeSubmit);

module.exports = router;
