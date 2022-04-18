const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"]
        },
        email: {
            type: String,
            required: [true, "Please add your e-mail"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Please add a password"]
        },
        picture: {
            type: String,
            default: "profile1.jpg"
        },
        role: {
            type: String,
            default: "user"
        },
        reviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema)