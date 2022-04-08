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
            data: Buffer,
            contentType: String
        },
        role: {
            type: String,
            default: "User"
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema)