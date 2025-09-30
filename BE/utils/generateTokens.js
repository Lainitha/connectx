import jwt from "jsonwebtoken";

const generateToken = (userID, res) => {
    const cookieSecure = process.env.COOKIE_SECURE === "true"; // set to true only if behind HTTPS
    const token = jwt.sign({ userID}, process.env.JWT_SECRET,{
        expiresIn: "15d",
    });
    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000, //15days,
        httpOnly : true,
        sameSite : "strict",
        secure : cookieSecure,
        path: "/",
    }
    )
};

export default generateToken;