const express = require("express");
const {
  addEvent,
  getEvents,
  updateEvent,
  removeEvent,
} = require("../controllers/event.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/", verifyToken, isAdmin, upload.single("imageUrl"), addEvent);
router.get("/", getEvents);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("imageUrl"),
  updateEvent,
);
router.delete("/:id", verifyToken, isAdmin, removeEvent);

module.exports = router;
