const express = require("express");
const {
  addPermission,
  getPermissions,
  updatePermission,
  removePermission,
} = require("../controllers/permission.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/", verifyToken, addPermission);
router.get("/", verifyToken, getPermissions);
router.patch("/:id", verifyToken, isAdmin, updatePermission);
router.delete("/:id", verifyToken, removePermission);

module.exports = router;
