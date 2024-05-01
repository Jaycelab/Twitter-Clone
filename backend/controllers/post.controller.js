import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

//CREATE POST
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

//DELETE POST
export const deletePost = async (req, res) => {
  try {
    const post = await findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    //check if user is authorized to delete post
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    //deletes latest image photo from cloudinary to avoid clutter using destroy method
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    //deletes post from database (mongodb) and returns success message
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//COMMENT ON POST
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    //check if text is provided
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };
    //push method to add comment to post
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
