const asyncHandler = require("express-async-handler");

const Game = require("../models/gameModel");
const User = require("../models/userModel");

// Fetch all games
const getGames = asyncHandler( async (req, res) => {
    const games = await Game.find({ public: true })
    res.json(games);
})

// Fetch one game by ID
const getGame = asyncHandler( async (req, res) => {
    const game = await Game.findById(req.params.id);

    if(!game){
        res.status(400)
        throw new Error("Game not found")
    }

    res.json(game);
})

// Add a game
const addGame = asyncHandler( async (req, res) => {
    if(!req.body.title || !req.body.cover || !req.body.summary){
        res.status(400)
        throw new Error("Please provide all necessary data")
    }

    //Check for user
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    const game = await Game.create({
        title: req.body.title,
        cover: req.body.cover,
        summary: req.body.summary,
        submittedBy: req.user.id,
    });

    res.json({ message: `Game submitted: ${req.body.title}` });
})

// Update a game
const updateGame = asyncHandler( async (req, res) => {
    const game = await Game.findById(req.params.id);

    if(!game){
        res.status(400)
        throw new Error("Game not found")
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

    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updatedGame);
})

// Delete a game
const deleteGame = asyncHandler( async (req, res) => {
    const game = await Game.findById(req.params.id);

    if(!game){
        res.status(400)
        throw new Error("Game not found")
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

    await game.remove();

    res.json({ id: req.params.id });
})

module.exports = { getGames, getGame, addGame, updateGame, deleteGame }