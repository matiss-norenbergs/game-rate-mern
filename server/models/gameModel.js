const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = Schema(
    {
        review: String,
        author: String,
        authorId: mongoose.Schema.Types.ObjectId,
        rating: Number
    },
    {
        timestamps: true
    }
);

const gameSchema = Schema(
    {
        title: {
            type: String,
            required: [true, "Provide the games title"],
        },
        cover: {
            type: String,
            required: [true, "Provide a link for the games cover picture"]
        },
        summary: {
            type: String,
            required: [true, "Provide a summary for the game"]
        },
        trailer: {
            type: String,
            default: ""
        },
        tags: {
            type: Array,
            required: [true, "Provide at least one tag"]
        },
        rating1: {
            type: Number,
            default: 0
        },
        rating2: {
            type: Number,
            default: 0
        },
        rating3: {
            type: Number,
            default: 0
        },
        rating4: {
            type: Number,
            default: 0
        },
        rating5: {
            type: Number,
            default: 0
        },
        reviews: [
            reviewSchema
        ],
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        publicVisible: {
            type: Boolean,
            default: false
        },
        publishedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Game", gameSchema)