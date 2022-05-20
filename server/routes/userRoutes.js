const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser, getUsers, getTopUsers, updatePicture, updatePassword, updateRole, getAdmin, countUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Register a new user
router.post("/", registerUser);

// Login a registered user
router.post("/login", loginUser);

// Get single users basic data
router.get("/user/:id", getUser);

// Get top 3 users
router.get("/topusers", getTopUsers);

// Get all users - admin
router.get("/allusers", protect, getUsers);

// Update users picture
router.put("/updatepicture", protect, updatePicture);

// Update users password
router.put("/updatepass", protect, updatePassword);

// Update users role
router.put("/updaterole/:id", protect, updateRole);

// Check if user is admin
router.get("/isAdmin", protect, getAdmin);

// Counts users that aren't admins
router.get("/count", protect, countUsers);

module.exports = router