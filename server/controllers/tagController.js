const asyncHandler = require("express-async-handler");

const Tag = require("../models/tagModel");

//Fetch all tags
const getTags = asyncHandler( async (req, res) => {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
});

// Fetch one tag by ID
const getTag = asyncHandler( async (req, res) => {
    const tag = await Tag.findById(req.params.id);

    if(!tag){
        res.status(400)
        throw new Error("Game not found")
    }

    res.json(tag);
})

//Add a tag
const addTag = asyncHandler( async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error("Please provide the tag name")
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

    const tag = await Tag.create({
        name: req.body.name,
        meaning: req.body.meaning,
    });

    res.json({ message: `Tag created: ${req.body.name}` });
})

//Update a tag
const updateTag = asyncHandler( async (req, res) => {
    const tag = await Tag.findById(req.params.id);

    if(!tag){
        res.status(400)
        throw new Error("Tag not found")
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

    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updatedTag);
})

//Delete a tag
const deleteTag = asyncHandler( async (req, res) => {
    const tag = await Tag.findById(req.params.id);

    if(!tag){
        res.status(400)
        throw new Error("Tag not found")
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

    await tag.remove();

    res.json({ id: req.params.id });
})

module.exports = { getTags, getTag, addTag, updateTag, deleteTag }