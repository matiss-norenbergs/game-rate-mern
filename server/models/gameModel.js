const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = Schema(
    {
        author: String,
        authorId: mongoose.Schema.Types.ObjectId,
        review: String,
        rating: Number,
        likes: [
            Schema.Types.ObjectId
        ],
        dislikes: [
            Schema.Types.ObjectId
        ]
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
        rating: {
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