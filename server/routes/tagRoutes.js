const express = require("express");
const router = express.Router();
const { getTags, addTag, updateTag, deleteTag  } = require("../controllers/tagController");
const { protect } = require("../middleware/authMiddleware");


router.get('/', getTags);

router.post('/', protect, addTag);

router.put('/:id', protect, updateTag);

router.delete('/:id', protect, deleteTag);

module.exports = router