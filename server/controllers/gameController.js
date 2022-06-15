const asyncHandler = require("express-async-handler");
const moment = require("moment");
const Game = require("../models/gameModel");

// Fetch all games
const getGames = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }

    const games = await Game.find().sort({ updatedAt: -1 });

    res.json(games);
})

// Fetch all published games
const getGamesPublic = asyncHandler( async (req, res) => {
    const { field, order } = req.params;
    const tags = JSON.parse(req.params.tags);

    const getGamesFiltered = () => {
        if(tags.length > 0){
            return Game.find({ publicVisible: true, tags: { $all: tags } }, 'title cover rating').sort({[field]: order});
        }else{
            return Game.find({ publicVisible: true }, 'title cover rating').sort({[field]: order});
        }
    }

    const games = await getGamesFiltered();

    res.json(games);
})

// Fetch 5 latest published games
const getGamesPublicLast = asyncHandler( async (req, res) => {
    const games = await Game.find({ publicVisible: true }, 'title cover publishedAt').sort({ publishedAt: -1 }).limit(5);
    res.json(games);
})

// Fetch games that user has reviewed
const getUsersReviewedGames = asyncHandler( async (req, res) => {
    const userId = req.params.id;

    const games = await Game.find(
        { reviews: { $elemMatch: { authorId: userId } } }, 
        { title: 1, 'reviews.$': 1 } 
    )
    .sort(
        { "reviews.createdAt": 1 }
    );

    let positiveReviews = 0;
    games.forEach(game => {
        if(game.reviews[0].likes.length > game.reviews[0].dislikes.length){
            positiveReviews++;
        }
    })

    res.json({ games, positiveReviews });
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

    if(!req.user){
        res.status(401)
        throw new Error("User not found!")
    }

    if(req.user.role === "suspended"){
        res.status(401)
        throw new Error("Your account is suspended!")
    }

    //Check users recent submission amount
    const timeNow = moment(Date.now()).subtract(2, 'minutes').format();
    const userCreatedGame = await Game.find({ submittedBy: req.user._id, createdAt: { $gt: timeNow } }).sort({ createdAt: -1 });
    if(userCreatedGame.length >= 1 && req.user.role !== "admin"){
        res.status(400)
        throw new Error("User can submit only 1 game per 2 minutes!")
    }

    //Check if simular game exists
    const game = await Game.find({ title: { $regex: `${title}`, $options: "i" }}, 'title').limit(1);
    if(game.length >= 1){
        res.status(400)
        throw new Error("Game already exists with title: " + game[0].title)
    }

    //Create new game
    await Game.create({
        title,
        cover,
        summary,
        tags,
        submittedBy: req.user.id,
    });

    res.json(`Game submitted: ${title}`);
})

// Update a game
const updateGame = asyncHandler( async (req, res) => {
    const game = await Game.findById(req.params.id);
    if(!game){
        res.status(400)
        throw new Error("Game not found")
    }

    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }

    const isPublished = async (data) => {
        const publishedAt = moment(Date.now()).format();

        return data.publicVisible && !game.publishedAt ? { ...data, publishedAt } : { ...data };
    }

    //Checking if published or not
    const gameData = await isPublished(req.body);
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, gameData, { new: true });

    res.json(updatedGame.title);
})

// Delete a game
const deleteGame = asyncHandler( async (req, res) => {
    const game = await Game.findById(req.params.id);
    if(!game){
        res.status(400)
        throw new Error("Game not found")
    }

    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }

    await game.remove();

    res.json({ id: req.params.id });
})

// Getting game data for admin panel
const gameData = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }

    const yesterday = moment().subtract(1, "days").format();

    const games = await Game.countDocuments({});
    const publicGames = await Game.countDocuments({ publicVisible: true });
    const gamesSubmitted = await Game.countDocuments({ createdAt: { $gt: yesterday } })

    res.json({ games, publicGames, gamesSubmitted });
})

// Fetch last 10 submitted games
const getGamesLastSubmit = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }
    
    const games = await Game.find({}, 'title createdAt updatedAt publicVisible').sort({ createdAt: -1 }).limit(10);
    res.json(games);
})

module.exports = { getGames, getGamesPublic, getGamesPublicLast, getUsersReviewedGames, getGame, addGame, updateGame, deleteGame, gameData, getGamesLastSubmit }