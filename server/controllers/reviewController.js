const asyncHandler = require("express-async-handler");
const Game = require("../models/gameModel");
const User = require("../models/userModel");

//Add review for a game
const addReview = asyncHandler( async (req, res) => {
    const { id, review, rating } = req.body;
    if(!review || !rating){
        res.status(400)
        throw new Error("Please provide all necessary data!")
    }

    //Check for game
    const game = await Game.findById(id);
    if(!game){
        res.status(400)
        throw new Error("Game not found!")
    }

    //Check for user
    if(!req.user){
        res.status(401)
        throw new Error("Valid user not found!")
    }
    
    //Get users data live
    const user = await User.findById(req.user._id, 'role reviewCount');

    //Check if user is suspended
    if(user.role === "suspended"){
        res.status(401)
        throw new Error("Your account is suspended!")
    }

    //Check if user has a review already
    const userCreatedReview = await Game.find({ _id: id, 'reviews.authorId': req.user._id }).limit(1);
    if(userCreatedReview.length >= 1){
        res.status(401)
        throw new Error("You already have a review for this game!")
    }

    //Add the users review
    const { name: author, _id: authorId } = req.user;
    const reviews = { review, author, authorId, rating };
    await Game.findByIdAndUpdate(id, { $push: { reviews } }, { new: true, timestamps: false });

    //Update users review count
    const reviewCount = user.reviewCount + 1;
    await User.findByIdAndUpdate(req.user._id, { reviewCount }, { new: true, timestamps: false });

    //Calculate AVG rating for the game
    const gameRating = await Game.findById(id, 'reviews');
    if(gameRating){
        const gameReviewCount = gameRating.reviews.length;
        let revievSum = 0;

        gameRating.reviews.forEach(({rating}) => {
            revievSum += rating;
        });

        const rating = Math.round((revievSum / gameReviewCount) * 10) / 10;
        await Game.findByIdAndUpdate(id, { rating }, { new: true, timestamps: false });
    }

    res.json("Review added!");
})

const deleteReview = asyncHandler( async (req, res) => {
    const { gameId, reviewId } = req.body;
    const game = await Game.findById(gameId);
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
    const userCreatedReview = await Game.find({ _id: gameId, 'reviews.authorId': req.user._id }).limit(1);
    if(userCreatedReview.length < 1){
        res.status(401)
        throw new Error("You don't have a review for this game")
    }

    //Delete users review
    await Game.findByIdAndUpdate(gameId, { $pull: { reviews: { _id: reviewId } } }, { new: true, timestamps: false });

    //Update users review count
    const user = await User.findById(req.user._id, 'reviewCount');
    const reviewCount = user.reviewCount - 1;
    await User.findByIdAndUpdate(req.user._id, { reviewCount }, { new: true, timestamps: false });

    //Calculate games rating
    const gameRating = await Game.findById(gameId, 'reviews');
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

        await Game.findByIdAndUpdate(gameId, { rating }, { new: true, timestamps: false });
    }

    res.json("Review deleted!");
})

module.exports = { addReview, deleteReview }