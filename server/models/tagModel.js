const mongoose = require("mongoose");
const { Schema } = mongoose;

const tagSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Enter the tag"]
        },
        meaning: String
    }
);

module.exports = mongoose.model("Tag", tagSchema)