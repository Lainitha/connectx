import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateTokens.js";


export const signup = async(req, res) => 
    {try {
        const { username, fullName, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(404).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email: email });
        const existingUsername = await User.findOne({ username: username });
        if (existingUser || existingUsername) {
            return res.status(404).json({ message: "Email or Username already in use" });
        }

        if (password.length < 6) {
            return res.status(404).json({ message: "Password must be at least 6 characters long" });
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
            res.status(404).json({ message: "Failed to register user" });
        }
    }

    catch(error){
        console.error(`Error in signup: ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
};


export const login =async (req, res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect =  await bcrypt.compare(password, user?.password || "") ;

        if (!user || ! isPasswordCorrect){
            return res.status(404).json({
                error: "Invalid username or password"})
        }
        generateToken(user._id, res);
        res.status(200).json({ _id: user._id, 
            username: user.username, 
            fullName: user.fullName, 
            email: user.email,
            followers: user.followers,
            following: user.following, 
            profileImg: user.profileImg, 
            coverImg: user.coverImg, 
            bio: user.bio, 
            link: user.link,});

    } catch (error){
        console.log(`Error in login: ${error.message}`);
        res.status(500).json({message: "Internal Server Error"
    });
}
};




export const logout = async(req, res) => {
    try{
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            path: "/",
        });
        // Additionally overwrite cookie with immediate expiry for stubborn browsers
        res.cookie("jwt", "", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            expires: new Date(0),
            path: "/",
        });
        res.set("Cache-Control", "no-store");
        res.status(200).json({message: "Logged out successfully"})
        }

    
    catch(error){
        console.log(`Error in logout: ${error.message}`);
        res.status(500).json({message: "Internal Server Error"          
    })
    };
};


export const getMe = async(req, res) => {
    try{
        const user = await User.findOne({_id: req.user._id}).select("-password");
        res.status(200).json(user);
    }
    catch(error){
        console.log(`Error in getMe: ${error.message}`);
        res.status(500).json({message: "Internal Server Error"          
    })
    }
};



