const express = require("express");
const router = express.Router();
const { follow, unfollow } = require("../controllers/followController");
const { protect } = require("../middleware/authMiddleware");

// Follow other user
router.put("/follow/:id", protect, follow);

// Unfollow other user
router.put("/unfollow/:id", protect, unfollow);

module.exports = router