const asyncHandler = require("express-async-handler");
const moment = require("moment");
const Post = require("../models/postModel");

//Fetch all posts
const getPosts = asyncHandler( async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.json(posts);
})

//Fetch one post by ID
const getPost = asyncHandler( async (req, res) => {
    const post = await Post.findById(req.params.id);

    if(!post){
        res.status(400)
        throw new Error("Post not found")
    }

    res.json(post);
})

//Add a new post
const addPost = asyncHandler( async (req, res) => {
    const { title, text } = req.body;

    if(!title || !text){
        res.status(400)
        throw new Error("Please provide all necessary data")
    }

    //Check for user
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    //Checking if the user is admin
    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }

    //Create new post
    await Post.create({
        title,
        text,
        author: req.user.name,
        authorId: req.user.id
    });

    res.json({ message: `Post created: ${title}` })
})

//Update a post
const updatePost = asyncHandler( async (req, res) => {
    const post = await Post.findById(req.params.id);

    if(!post){
        res.status(400)
        throw new Error("Post not found")
    }

    //Check for user
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    //Checking if the user is admin
    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updatedPost.title);
})

//Delete a post
const deletePost = asyncHandler( async (req, res) => {
    const post = await Post.findById(req.params.id);

    if(!post){
        res.status(400)
        throw new Error("Post not found")
    }

    //Check for user
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    //Checking if the user is admin
    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }

    await post.remove();

    res.json({ id: req.params.id });
})

module.exports = { getPosts, getPost, addPost, updatePost, deletePost }