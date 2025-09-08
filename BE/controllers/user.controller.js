import User from "../models/user.model.js";


export  const getProfile = async (req, res) => {
    try{
        const { username } = req.params; // Extract username from req.params // destructuring
        const user = await User.findOne({ username})

        if (!user){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    }
    catch(error){
        console.error(`Error in getProfile: ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
}
