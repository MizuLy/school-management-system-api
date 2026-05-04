const express = require("express");
const {
  register,
  login,
  current,
  logout,
} = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/:id", verifyToken, current);

module.exports = router;
