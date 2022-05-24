const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser, getUsers, getTopUsers, updatePicture, updatePassword, updateRole, getAdmin, countUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Register a new user
router.post("/", registerUser);

// Login a registered user
router.post("/login", loginUser);

// Get single users basic data - Public
router.get("/user/:id", getUser);

// Get top 3 users - Public
router.get("/topusers", getTopUsers);

// Get all users - Admin
router.get("/allusers", protect, getUsers);

// Update users picture - User
router.put("/updatepicture", protect, updatePicture);

// Update users password - User
router.put("/updatepass", protect, updatePassword);

// Update users role - Admin
router.put("/updaterole/:id", protect, updateRole);

// Check if user is admin - Admin
router.get("/isAdmin", protect, getAdmin);

// Counts users that aren't admins - Admin
router.get("/count", protect, countUsers);

module.exports = router