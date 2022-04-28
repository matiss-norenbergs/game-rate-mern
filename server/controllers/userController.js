const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Register new user with POST
const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password } = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please add all fields!")
    }

    //Check existance
    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            role: user.role,
            reviews: user.reviews,
            token: generateToken(user.id)
        });
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})

// Login the user with POST
const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body;

    //Check users email
    const user = await User.findOne({ email });

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            role: user.role,
            reviews: user.reviews,
            token: generateToken(user.id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid login details")
    }
})

// Checks if the current user has "admin" role
const getAdmin = asyncHandler( async (req, res) => {
    if(req.user.role === "admin"){
        res.status(200).json(true);
        return;
    }

    res.status(200).json(false);
    return;
})

//Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

const countUsers = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }
    
    const users = await User.countDocuments({ role: "user" });

    res.json({ users });
})

module.exports = { registerUser, loginUser, getAdmin, countUsers }