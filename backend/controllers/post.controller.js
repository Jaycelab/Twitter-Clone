import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    //let variable to revise
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    //check if user exists, if not return error
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    //check if text or image is provided
    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    //if image is provided, upload it to cloudinary

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    //saves new post to database and returns success created message
    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
};
