const express = require("express");
const router = express.Router();
const { likeInc, likeDec, dislikeInc, dislikeDec } = require("../controllers/likeController");
const { protect } = require("../middleware/authMiddleware");

router.put('/likeInc/:gameId/:reviewId', protect, likeInc);

router.put('/likeDec/:gameId/:reviewId', protect, likeDec);

router.put('/dislikeInc/:gameId/:reviewId', protect, dislikeInc);

router.put('/dislikeDec/:gameId/:reviewId', protect, dislikeDec);



module.exports = router