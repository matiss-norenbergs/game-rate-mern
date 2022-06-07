const express = require("express");
const router = express.Router();
const { addReview, deleteReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// Add a review
router.put('/', protect, addReview);

// Delete a review
router.put('/delete_review', protect, deleteReview);

module.exports = router