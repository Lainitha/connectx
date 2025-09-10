import cloudinary from 'cloudinary';
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!img && !text) {
            return res.status(400).json({ message: "Post cannot be empty" });
        }

        if (img) {
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        });
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.log(`Error in createPost: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own posts" }); 
        };

        if (post.img) {
            const imgId =  post.img.split('/').pop().split('.')[0]; // Extract public ID from URL 
            await cloudinary.uploader.destroy(imgId);           
        }

        // awafindByIdAndDeleteit post.(); 
        await Post.findByIdAndDelete({_id : id});

        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.log(`Error in deletePost: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id; //from protectRoute middleware ?? how??

        if (!text){
            return res.status(400).json({message: "Comment cannot be empty"});  
        };

        const post = await Post.findOne({_id: postId});
        if (!post){
            return res.status(404).json({message: "Post not found"});  
        }

        const comment = {
            user : userId,
            text
        }

        post.comments.push(comment);
        await post.save();
        res.status(201).json({post});

}   catch (error) {
        console.log(`Error in createComment: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }  ;

};

export const likeUnlikePost = async (req, res) => {
    try{
        const userId = req.user._id;
        const {_id: postId} = req.params;

        const post = await Post.findOne(postId);   
        if (!post){
            return res.status(404).json({message: "Post not found"});
        };

        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost){
            //unlike
            await Post.updateOneAndUpdate({_id : postId},{$pull : {likes : userId}} );
            await User.updateOneAndUpdate({_id : userId},{$pull : {likedPosts : postId}} );
            res.status(200).json({message: "Post unliked successfully"});  
        }
        else{
            //like
            post.likes.push(userId);
            await User.updateOneAndUpdate({_id : userId},{$push : {likedPosts : postId}} );
            await post.save();
            res.status(200).json({message: "Post liked successfully"}); 

            const newNotification = new Notification({          //send notification
                from : userId,
                to : post.user,  // is this return id?????
                type: "like"
            });
            await newNotification.save();
            res.status(200).json({message:"Notification Sent Successfully"});
        }}catch(error){
        console.log(`Error in likeUnlike: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path : "user",
            select : "-password"})
            .populate({
                path : "comments.user",
                select : "-password -email -bio -link -followers -following -coverImg -profileImg -fullName -createdAt -updatedAt -__v"});
        if (posts.length === 0){
            return res.status(404).json([]);
        };

        res.status(200).json({posts});
    }
    catch(error){
        console.log(`Error in getAllPosts: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    };
};


export const getLikedPosts = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId)  //....
        if (!user){
            return res.status(404).json({message: "User not found"});
        };
        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
        .sort({ createdAt: -1 })
        .populate({path: "user", select: "-password"})
        .populate({path: "comments.user", select: "-password -email -bio -link -followers -following -coverImg -profileImg -fullName -createdAt -updatedAt -__v"});
    }
    catch(error){
        console.log(`Error in getLikedPosts: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    };
};