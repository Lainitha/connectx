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



export const followUnFollowUser = async (req, res) => {

    try{
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id){
            return res.status(400).json({message: "cant follow yourself and unfollow yourself"});
        }

        if (!userToModify || !currentUser){
            return res.status(404).json({message: "User not found"});
        }

        const isFollowing = currentUser.following.includes(id);
        if (isFollowing){

            //unfollow
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            res.status(200).json({message: "User unfollowed successfully"});
        }
        else{
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
            res.status(200).json({message: "User followed successfully"});
            //send notification
        }
    }
        catch(error){
        console.error(`Error in getProfile: ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
}
