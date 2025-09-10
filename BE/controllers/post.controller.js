import cloudinary from "../config/cloudinary.js";

export const createPost = (req, res) => {
    try{
        const {text } = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(_id: userId);
        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        if (!img && !text ){
            return res.status(400).json({message: "Post cannot be empty"});
        };

        if (!img){
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

    }
    catch(error)
    {console.log(`Error in createPost: ${error.message}`);
    res.status(500).json({message: "Internal Server Error"});
}};
