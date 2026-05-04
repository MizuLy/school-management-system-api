const express = require("express");
const {
  addGuardian,
  getGuardians,
  updateGuardian,
  removeGuardian,
} = require("../controllers/guardian.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/", verifyToken, isAdmin, addGuardian);
router.get("/", verifyToken, getGuardians);
router.put("/:id", verifyToken, isAdmin, updateGuardian);
router.delete("/:id", verifyToken, isAdmin, removeGuardian);

module.exports = router;
