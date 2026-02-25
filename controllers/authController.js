const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,    
    });
};

const register = async (req, res) => {
    const user = await User.create(req.body);
    const token = createToken(user._id);
    
    res.status(201).json({
        msg: "Registration successful",
         user: { name: user.name }, 
         token });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) { 
        return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ msg: "Invalid credentials" });
    }   

    const token = createToken(user._id);
    

        res.status(200).json({  
        msg: "Login successful",
        user: { name: user.name, email: user.email },
        token,
    });
};

module.exports = { register, login };
