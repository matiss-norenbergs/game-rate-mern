const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameSchema = Schema(
    {
        title: {
            type: String,
            required: [true, "Provide the games title"],
        },
    },
    {
        cover: {
            type: String,
            required: [true, "Provide a link for the games cover picture"]
        }
    },
    {
        summary : {
            type: String,
            required: [true, "Provide a summary for the game"]
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Game", gameSchema)