import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try{
        const userId = req.user._id; //from protectRoute middleware ?? how??
        const notifications = await Notification.find({to: userId})
        .populate({path: "from", select: "username profileImg"}); //can be given as array or single values seperated by space

        await Notification.updateMany({to: userId}, { read: true});

        res.status(200).json({notifications});

    }
    catch(error){
        console.error(`Error in getNotifications: ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    };
};


export const deleteNotifications = async(req, res) => {
    try{
        const userId = req.user._id;

        await  Notification.deleteMany({to: userId});
        res.status(200).json({message: "Notifications cleared"});

    }
    catch(error){
        console.error(`Error in deleteNotifications: ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    };
};