const express = require("express");
const { addClass, getClasses } = require("../controllers/class.controller");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/", verifyToken, addClass);
router.get("/", verifyToken, getClasses);

module.exports = router;
