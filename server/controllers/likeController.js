const asyncHandler = require("express-async-handler");
const Game = require("../models/gameModel");

const likeInc = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    const { gameId, reviewId } = req.params;
    const userId = req.user._id;

    const game = await Game.findOne(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } } }, 
        { 'reviews.$': 1 }
    );
    if(!game){
        res.status(400)
        throw new Error("Review not found!")
    }

    const userHasLiked = await Game.findOne(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } }, reviews: { $elemMatch: { likes: userId } } }, 
        { 'reviews.$': 1 }
    );
    if(userHasLiked){
        res.status(400)
        throw new Error("User has liked!")
    }

    const likeUpdate = await Game.findOneAndUpdate(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } } }, 
        { $push: {
            'reviews.$.likes': userId
        } },
        { new: true, timestamps: false }
    );

    if(!likeUpdate){
        res.status(400)
        throw new Error("Like action failed!")
    }

    await Game.findOneAndUpdate(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } } }, 
        { $pull: {
            'reviews.$.dislikes': userId
        } },
        { new: true, timestamps: false }
    );

    res.json({ success: true });
})

const likeDec = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    const { gameId, reviewId } = req.params;
    const userId = req.user._id;

    const game = await Game.findOne(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } } }, 
        { 'reviews.$': 1 }
    );
    if(!game){
        res.status(400)
        throw new Error("Review not found!")
    }

    const likeUpdate = await Game.findOneAndUpdate(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } } }, 
        { $pull: {
            'reviews.$.likes': userId
        } },
        { new: true, timestamps: false }
    );

    if(!likeUpdate){
        res.status(400)
        throw new Error("Unlike action failed!")
    }

    res.json({ success: true });
})

const dislikeInc = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    const { gameId, reviewId } = req.params;
    const userId = req.user._id;

    const game = await Game.findOne(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } } }, 
        { 'reviews.$': 1 }
    );
    if(!game){
        res.status(400)
        throw new Error("Review not found!")
    }

    const userHasDisiked = await Game.findOne(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } }, reviews: { $elemMatch: { dislikes: userId } } }, 
        { 'reviews.$': 1 }
    );
    if(userHasDisiked){
        res.status(400)
        throw new Error("User has disliked!")
    }

    const dislikeUpdate = await Game.findOneAndUpdate(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } } }, 
        { $push: {
            'reviews.$.dislikes': userId
        } },
        { new: true, timestamps: false }
    );

    if(!dislikeUpdate){
        res.status(400)
        throw new Error("Dislike action failed!")
    }

    await Game.findOneAndUpdate(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } } }, 
        { $pull: {
            'reviews.$.likes': userId
        } },
        { new: true, timestamps: false }
    );

    res.json({ success: true });
})

const dislikeDec = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    const { gameId, reviewId } = req.params;
    const userId = req.user._id;

    const game = await Game.findOne(
        {  _id: gameId, reviews: { $elemMatch: { _id: reviewId } } }, 
        { 'reviews.$': 1 }
    );
    if(!game){
        res.status(400)
        throw new Error("Review not found!")
    }

    const dislikeUpdate = await Game.findOneAndUpdate(
        { _id: gameId, reviews: { $elemMatch: { _id: reviewId } } }, 
        { $pull: {
            'reviews.$.dislikes': userId
        } },
        { new: true, timestamps: false }
    );

    if(!dislikeUpdate){
        res.status(400)
        throw new Error("Undislike action failed!")
    }

    res.json({ success: true });
})

module.exports = { likeInc, likeDec, dislikeInc, dislikeDec }