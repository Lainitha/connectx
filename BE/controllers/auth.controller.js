import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateTokens.js";


export const signup = async(req, res) => 
    {try {
        const { username, fullName, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email: email });
        const existingUsername = await User.findOne({ username: username });
        if (existingUser || existingUsername) {
            return res.status(400).json({ message: "Email or Username already in use" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        //hasing the password before saving to db
        // 12345 = CVGTU23F6H7
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword
        });


        if (newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({ _id: newUser._id, 
                username: newUser.username, 
                fullName: newUser.fullName, 
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following, 
                profileImg: newUser.profileImg, 
                coverImg: newUser.coverImg, 
                bio: newUser.bio, 
                link: newUser.link,});
        }
        else {
            res.status(400).json({ message: "Failed to register user" });
        }
    }

    catch(error){
        console.error(`Error in signup: ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
};


export const login = (req, res) => (req,res)=>{
    res.send("This is signup route from controler");
};

export const logout = (req, res) => (req,res)=>{
    res.send("This is signup route from controler");
};


