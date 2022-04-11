const express = require("express");
const router = express.Router();
const { getGames, getGamesPublic, getGamesPublicLast, getGame, addGame, updateGame, deleteGame } = require("../controllers/gameController");
const { protect } = require("../middleware/authMiddleware");


router.get('/', protect, getGames);

router.get('/public', getGamesPublic);

router.get('/publiclast', getGamesPublicLast);

router.get('/:id', getGame);

router.post('/', protect, addGame);

router.put('/:id', protect, updateGame);

router.delete('/:id', protect, deleteGame);

module.exports = router