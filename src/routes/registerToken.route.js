const express = require("express");

const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const {
  generateRegistrationToken,
  registerQR,
} = require("../controllers/registerToken.controller");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/generate", verifyToken, isAdmin, generateRegistrationToken); // Admin generate token
router.post("/:token", upload.single("imageUrl"), registerQR); // Student register via token - no need auth

module.exports = router;
