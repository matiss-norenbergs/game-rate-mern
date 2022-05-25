const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const getFollows = asyncHandler( async (req, res) => {
    const userId = req.params.id;

    const follows = await User.findById(userId, 'following followers');
    if(!follows){
        res.status(400)
        throw new Error("Couldn't fetch follows")
    }

    const following = await User.find({ _id: { $in: follows.following } }, 'name picture');
    const followers = await User.find({ _id: { $in: follows.followers } }, 'name picture');

    res.json({ following, followers });
})

const follow = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    const myId = req.user._id;
    const selectedUser = req.params.id;
    const isFollowing = await User.findOne({ _id: myId, following: [ selectedUser ] });

    if(isFollowing){
        res.status(400)
        throw new Error("User is already followed")
    }

    const follow = await User.findByIdAndUpdate(
        { _id: myId },
        { 
            $push: {
                following: selectedUser
            } 
        },
        { new: true, timestamps: false }
    );

    if(!follow){
        res.status(400)
        throw new Error("Failed to follow")
    }

    const followers = await User.findByIdAndUpdate(
        { _id: selectedUser },
        {
            $push: {
                followers: myId
            }
        },
        { new: true, timestamps: false }
    );

    if(!followers){
        res.status(400)
        throw new Error("Failed to add follower")
    }

    res.json({ success: true });
})

const unfollow = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    const myId = req.user._id;
    const selectedUser = req.params.id;

    const follow = await User.findByIdAndUpdate(
        { _id: myId },
        { 
            $pull: {
                following: selectedUser
            } 
        },
        { new: true, timestamps: false }
    );

    if(!follow){
        res.status(400)
        throw new Error("Failed to unfollow")
    }

    const followers = await User.findByIdAndUpdate(
        { _id: selectedUser },
        {
            $pull: {
                followers: myId
            }
        },
        { new: true, timestamps: false }
    );

    if(!followers){
        res.status(400)
        throw new Error("Failed to remove follower")
    }

    res.json({ success: true });
})

module.exports = { getFollows, follow, unfollow }