const express = require("express");
const router = express.Router();
const { getGames, getGamesPublic, getGamesPublicLast, getUsersReviewedGames, getUsersRank, getGame, addGame, addGameReview, deleteGameReview, updateGame, deleteGame, gameData, getGamesLastSubmit } = require("../controllers/gameController");
const { protect } = require("../middleware/authMiddleware");

// Get all games - Admin
router.get('/', protect, getGames);

// Get all published games
router.get('/public/:field/:order/:tags', getGamesPublic);

// Get last 5 published games
router.get('/publiclast', getGamesPublicLast);

// Get single users game reviews and positive review count (likes > dislikes)
router.get('/users_reviews/:id', getUsersReviewedGames);

// Get single game
router.get('/:id', getGame);

// Add a game - User
router.post('/', protect, addGame);

// Add a review to a game - User
router.put('/addreview/:id', protect, addGameReview);

// Delete a review - User
router.put('/deletereview/:id', protect, deleteGameReview);

// Update a game - Admin
router.put('/:id', protect, updateGame);

// Delete a game - Admin
router.delete('/:id', protect, deleteGame);

// Get data about games - Admin
router.get('/admin/gamedata', protect, gameData);

// Get last 10 submitted games - Admin
router.get('/admin/submittedlast', protect, getGamesLastSubmit);

module.exports = router