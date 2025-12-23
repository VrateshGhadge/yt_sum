const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require('../models/user')

//register
// login

async function registerUser(req, res){
    const {username, password, email} = req.body;
    if(!username || !password || !email){
        return res.status(400).json({
            msg:"All fields are required"
        })
    }

    try{ 
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({
                msg:"User already exist"
            })
        }
        const newUser = new User({
            username,
            email,
            password   //ch
        });
        await newUser.save();

        const token = jwt.sign({
                id: newUser._id,
                email: newUser.email,
            },process.env.JWT_SECRET, {expiresIn: "1h"}
        )
        const {password: _, ...userWithoutPassword } = newUser.toObject();

        res.status(201).json({
            success: true,
            message:"User created successfully",
            data: {token, user: userWithoutPassword}
        })
        
    }catch(err){
        console.error("REGISTER ERROR:", err);
        if(err.code === 11000){
            return res.status(409).json({
                msg: "User already exist" //for database safety
            })
        }
        return res.status(500).json({
            msg:"Something went wrong",
            error: err.message
        })
    }
}

async function loginUser(req, res){
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            msg:"All fields are required"
        });
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                msg:"Invalid credentials"
            })
        }
        const isMatch = await user.comparePassword(password) //ch
        if(!isMatch) {
            return res.status(401).json({msg:"Invalid credentials"})
        }
        const token = jwt.sign({
            id: user._id,
            email: user.email
        },process.env.JWT_SECRET, {expiresIn:"1h"})

        const {password: _, ...userWithoutPassword } = user.toObject();

        res.json({
            success: true,
            message:"Login successfully",
            data: {user: userWithoutPassword, token}
        });
        
    }catch(err){
        return res.status(500).json({
            msg:"Something went wrong",
            error: err.message
        })
    }
}
module.exports = { registerUser , loginUser };



