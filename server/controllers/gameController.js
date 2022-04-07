const asyncHandler = require("express-async-handler");

// Fetch all games
const getGames = asyncHandler( async (req, res) => {
    res.json({ message: "Fetching games" })
})

// Add a game
const addGame = asyncHandler( async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error("Please add data")
    }
    res.json({ message: "Added game" })
})

// Update a game
const updateGame = asyncHandler( async (req, res) => {
    res.json({ message: "Updated a game" })
})

// Delete a game
const deleteGame = asyncHandler( async (req, res) => {
    res.json({ message: "Deleted a game" })
})

module.exports = { getGames, addGame, updateGame, deleteGame }