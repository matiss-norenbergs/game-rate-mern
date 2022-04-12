const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = Schema({
    reviewText: { type: String },
    reviewAuthor: { type: String },
    reviewAuthorId: { type: String }
}, { _id : true });

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
        tags: [
            {
                type: String
            }
        ],
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
            default: 1
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
        beenPublished: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Game", gameSchema)