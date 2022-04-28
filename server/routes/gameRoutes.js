const express = require("express");
const router = express.Router();
const { getGames, getGamesPublic, getGamesPublicLast, getGame, addGame, addGameReview, updateGame, deleteGame } = require("../controllers/gameController");
const { protect } = require("../middleware/authMiddleware");


router.get('/', protect, getGames);

router.get('/public/:field/:order/:tags', getGamesPublic);

router.get('/publiclast', getGamesPublicLast);

router.get('/:id', getGame);

router.post('/', protect, addGame);

router.put('/addreview/:id', protect, addGameReview);

router.put('/:id', protect, updateGame);

router.delete('/:id', protect, deleteGame);

module.exports = router