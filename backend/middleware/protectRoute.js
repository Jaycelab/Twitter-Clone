import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

//next function (getMe). next() is called after adding user object to request
export const protectRoute = async (req, res, next) => {
  try {
    //getting token from cookies. if !cookie but invalid handle error
    // valid token must === jwt token decoded. Return to request user object without password
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
    //return user but does not return password
    const user = await User.findById(decoded.userId).select("-password");

    //user not found error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //return user object to request (getMe)
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
