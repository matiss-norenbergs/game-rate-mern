const asyncHandler = require("express-async-handler");

const Game = require("../models/gameModel");


// Fetch all games
const getGames = asyncHandler( async (req, res) => {
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

    const games = await Game.find().sort({ updatedAt: -1 });

    res.json(games);
})

// Fetch all published games
const getGamesPublic = asyncHandler( async (req, res) => {
    const games = await Game.find({ publicVisible: true }, 'title cover');
    res.json(games);
})

// Fetch 5 latest published games
const getGamesPublicLast = asyncHandler( async (req, res) => {
    const games = await Game.find({ publicVisible: true }, 'title cover updatedAt').sort({ updatedAt: -1 }).limit(5);
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
    const { title, cover, summary, tags } = req.body;

    if(!title || !cover || !summary || !tags.length > 0){
        res.status(400)
        throw new Error("Please provide all necessary data")
    }

    //Check for user
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    //Check users recent submission amount
    const moment = require("moment");
    const timeNow = moment(Date.now()).subtract(2, 'minutes').format();
    const userCreatedGame = await Game.find({ submittedBy: req.user._id, createdAt: { $gt: timeNow } }).sort({ createdAt: -1 });

    if(userCreatedGame.length >= 1){
        res.status(400)
        throw new Error("User can submit 1 game per 2 minutes " + userCreatedGame[0].title)
    }

    //Check if simular game exists
    const game = await Game.find({ title: { $regex: `${title}`, $options: "i" }}, 'title').limit(1);

    if(game.length >= 1){
        res.status(400)
        throw new Error("Game already exists: " + game[0].title)
    }

    //Create new game
    await Game.create({
        title,
        cover,
        summary,
        tags,
        submittedBy: req.user.id,
    });

    res.json({ message: `Game submitted: ${title}` });
})

//Add review for a game
const addGameReview = asyncHandler(  async (req, res) => {
    const { review, rating } = req.body;

    if(!review || !rating){
        res.status(400)
        throw new Error("Please provide all necessary data")
    }

    //Check for game
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

    //Check if user has a review already
    const userCreatedReview = await Game.find({ _id: req.params.id, 'reviews.authorId': req.user._id }).limit(1);

    if(userCreatedReview.length >= 1){
        res.status(401)
        throw new Error("You already have a review for this game")
    }

    //Add the users review
    const author = req.user.name;
    const authorId = req.user._id;
    const reviews = { review, author, authorId, rating };

    await Game.findByIdAndUpdate(req.params.id, { $push: { reviews } }, { new: true, timestamps: false });

    res.json(reviews);
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

    res.json(updatedGame.title);
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

module.exports = { getGames, getGamesPublic, getGamesPublicLast, getGame, addGame, addGameReview, updateGame, deleteGame }