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

    // Check existance
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400)
        throw new Error("User with such email exists")
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
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
            token: generateToken(user.id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid login details")
    }
})

// Get single users data - public
const getUser = asyncHandler( async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId, 'name picture role following followers');
    if(!user){
        res.json(false);
        return;
    }

    const following = await User.find({ _id: { $in: user.following } }, 'name picture');
    const followers = await User.find({ _id: { $in: user.followers } }, 'name picture');

    res.json({ user, following, followers });
})

const getUsers = asyncHandler( async (req, res) => {
    // Check for user
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    //Checking if the user is admin
    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }

    const users = await User.find({}, 'name email role createdAt updatedAt');

    res.json(users);
})

const getTopUsers = asyncHandler( async (req, res) => {
    const users = await User.find({}, 'name picture positiveReviews').sort({ positiveReviews: -1 }).limit(3);

    res.json(users);
})

// Change users profile picture
const updatePicture = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(400)
        throw new Error("User doesn't exist")
    }

    const picture = req.body.picture;
    await User.findByIdAndUpdate(req.user.id, { picture }, { new: true, timestamps: false });

    res.json({ message: "Picture updated!" });
})

// Change users password
const updatePassword = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(400)
        throw new Error("User doesn't exist")
    }

    const { password, password2 } = req.body;
    if(password.lenght >= 8 || password !== password2){
        res.status(400)
        throw new Error("Invalid users input")
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword }, { new: true });

    res.json({ message: "Password updated!" });
})

// Change users role
const updateRole = asyncHandler( async (req, res) => {
    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }

    const role = req.body.role;
    await User.findByIdAndUpdate(req.params.id, { role }, { new: true });

    res.json("Users role updated!");
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

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

// Counts users that aren't suspended and aren't admins - Admin
const countUsers = asyncHandler( async (req, res) => {
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }

    if(req.user.role !== "admin"){
        res.status(401)
        throw new Error("User is not an admin")
    }
    
    const users = await User.countDocuments({});

    res.json({ users });
})

module.exports = { registerUser, loginUser, getUser, getUsers, getTopUsers, updatePicture, updatePassword, updateRole, getAdmin, countUsers }