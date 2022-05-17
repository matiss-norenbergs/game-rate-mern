const asyncHandler = require("express-async-handler");
const moment = require("moment");
const Game = require("../models/gameModel");
const User = require("../models/userModel");

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
    if(!userId){
        res.status(400)
        throw new Error("Users ID not found")
    }

    const games = await Game.find({ 'reviews.authorId': userId }, { title: 1, reviews: { $elemMatch: { authorId: userId } } } );
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

    // Get users data currently
    const user = await User.findById(req.user._id, 'role');

    // Check if user is suspended
    if(user.role === "suspended"){
        res.status(401)
        throw new Error("User is suspended")
    }

    //Check users recent submission amount
    const timeNow = moment(Date.now()).subtract(2, 'minutes').format();
    const userCreatedGame = await Game.find({ submittedBy: req.user._id, createdAt: { $gt: timeNow } }).sort({ createdAt: -1 });
    if(userCreatedGame.length >= 1 && req.user.role !== "admin"){
        res.status(400)
        throw new Error("User can submit 1 game per 2 minutes")
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

    res.json(`Game submitted: ${title}`);
})

//Add review for a game
const addGameReview = asyncHandler( async (req, res) => {
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
    
    //Get users data live
    const user = await User.findById(req.user._id, 'role reviewCount');

    //Check if user is suspended
    if(user.role === "suspended"){
        res.status(401)
        throw new Error("User is suspended")
    }

    //Check if user has a review already
    const userCreatedReview = await Game.find({ _id: req.params.id, 'reviews.authorId': req.user._id }).limit(1);
    if(userCreatedReview.length >= 1){
        res.status(401)
        throw new Error("You already have a review for this game")
    }

    //Add the users review
    const { name: author, _id: authorId } = req.user;
    const reviews = { review, author, authorId, rating };
    await Game.findByIdAndUpdate(req.params.id, { $push: { reviews } }, { new: true, timestamps: false });

    //Update users review count
    const reviewCount = user.reviewCount + 1;
    await User.findByIdAndUpdate(req.user._id, { reviewCount }, { new: true, timestamps: false });

    //Calculate AVG rating for the game
    const gameRating = await Game.findById(req.params.id, 'reviews');
    if(gameRating){
        const gameReviewCount = gameRating.reviews.length;
        let revievSum = 0;

        gameRating.reviews.forEach(({rating}) => {
            revievSum += rating;
        });

        const rating = Math.round((revievSum / gameReviewCount) * 10) / 10;
        await Game.findByIdAndUpdate(req.params.id, { rating }, { new: true, timestamps: false });
    }

    res.json({ message: "Review added!" });
})

const deleteGameReview = asyncHandler( async (req, res) => {
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

    //Check if user has a review
    const userCreatedReview = await Game.find({ _id: req.params.id, 'reviews.authorId': req.user._id }).limit(1);
    if(userCreatedReview.length < 1){
        res.status(401)
        throw new Error("You don't have a review for this game")
    }

    //Delete users review
    await Game.findByIdAndUpdate(req.params.id, { $pull: { reviews: { _id: req.body.review_id } } }, { new: true, timestamps: false });

    //Update users review count
    const user = await User.findById(req.user._id, 'reviewCount');
    const reviewCount = user.reviewCount - 1;
    await User.findByIdAndUpdate(req.user._id, { reviewCount }, { new: true, timestamps: false });

    //Calculate games rating
    const gameRating = await Game.findById(req.params.id, 'reviews');
    if(gameRating){
        const gameReviewCount = gameRating.reviews.length;
        let revievSum = 0;
        let rating = 0

        if(gameReviewCount !== 0){
            gameRating.reviews.forEach(({rating}) => {
                revievSum += rating;
            });

            rating = Math.round((revievSum / gameReviewCount) * 10) / 10;
        }

        await Game.findByIdAndUpdate(req.params.id, { rating }, { new: true, timestamps: false });
    }

    res.json({ message: "Review deleted!" });
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

module.exports = { getGames, getGamesPublic, getGamesPublicLast, getUsersReviewedGames, getGame, addGame, addGameReview, deleteGameReview, updateGame, deleteGame, gameData, getGamesLastSubmit }