const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
    try {
        const {email, password, name} = req.body
  
        // 1. Check if this email already exist in our database
        const data = await User.findOne({ email })

        // 2. if yes send error
        if(data){
            return res.status(409).json({ message: "email already exist", success: false})
        }

        // 3. if not present then run following code
        const hashPassword = await bcrypt.hash(password, 10)
        await User.create({...req.body, password: hashPassword})
        res.status(201).json({ message : "user register success"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, success: false})
        
    }
}

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        // 1. check if email exist in our database 
        const data = await User.findOne({ email })// if found will return object with all feilds

        // 2. if not present send error
        if(!data){
            return res.status(401).json({ message: "email not Found", success: false})
        }

        // 3. compare password 
        const isValid = await bcrypt.compare(password, data.password)

        // 4. if password do not match send error
        if(!isValid){
            return res.status(401).json({ message: "invalid password", success: false})
        }

        // 5. if isActive false send error
        if(!data.isActive){
            return res.status(401).json({ message: "account blocked by admin", success: false})
        }

        // 6. if password matched login success

        // JWT Token think of as icard
        const token = jwt.sign({ _id: data._id, name: data.name }, process.env.JWT_KEY, { expiresIn: "1d" } )
        
        // send secure cookie
        res.cookie( "ADMIN", token, { 
            maxAge:1000 * 60, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production" }) // 1 min // local -> false | live -> true
        
        res.status(200).json({ 
            message : "user login success", 
            data: { name: data.name, email: data.email },
            // token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, success: false})
        
    }
}

// Logout 
exports.logout = async (req, res) => {
    try {
        res.clearCookie("ADMIN")
        res.status(200).json({ message : "user logout success"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, success: false})
        
    }
}