const express = require("express");
const router = express.Router();
const { getFollows, follow, unfollow } = require("../controllers/followController");
const { protect } = require("../middleware/authMiddleware");

// Get users following/followers
router.get("/getFollows/:id", getFollows);

// Follow other user
router.put("/follow/:id", protect, follow);

// Unfollow other user
router.put("/unfollow/:id", protect, unfollow);

module.exports = router