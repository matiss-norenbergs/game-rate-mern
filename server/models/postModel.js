const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = Schema(
    {
        title: {
            type: String,
            required: [true, "Enter title for the post"]
        },
        text: {
            type: String,
            required: [true, "Enter text for the post"]
        },
        author: {
            type: String,
            required: true
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema)