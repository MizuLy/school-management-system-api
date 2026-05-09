const express = require("express");
const {
  addClass,
  getClasses,
  updateClass,
  removeClass,
} = require("../controllers/class.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/", verifyToken, isAdmin, addClass);
router.get("/", verifyToken, getClasses);
router.put("/:id", verifyToken, isAdmin, updateClass);
router.delete("/:id", verifyToken, isAdmin, removeClass);

module.exports = router;
