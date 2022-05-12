const express = require("express");
const router = express.Router();
const { getPosts, getPostsLast, getPost, addPost, updatePost, deletePost } = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

router.get('/', getPosts);

router.get('/last', getPostsLast);

router.get('/:id', getPost);

router.post('/', protect, addPost);

router.put('/:id', protect, updatePost);

router.delete('/:id', protect, deletePost);

module.exports = router