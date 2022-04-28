const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getAdmin, countUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/isAdmin", protect, getAdmin);
router.get("/count", protect, countUsers);

module.exports = router