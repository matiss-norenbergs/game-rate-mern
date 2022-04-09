const express = require("express");
const router = express.Router();
const { getGames, getGame, addGame, updateGame, deleteGame } = require("../controllers/gameController");
const { protect } = require("../middleware/authMiddleware");


router.get('/', getGames);

router.get('/:id', getGame);

router.post('/', protect, addGame);

router.put('/:id', protect, updateGame);

router.delete('/:id', protect, deleteGame);

module.exports = router