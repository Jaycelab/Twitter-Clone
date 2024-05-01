import Notification from "../models/notification.model.js";
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

    //check if post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };

    //push comments array to post and save to database
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//LIKE/UNLIKE POST
export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    //check if post exists. If liked, will unline, Else, will like the post
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    //check if user has already liked the post
    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //pull user id from likes array to unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      //res.status(200).json({ message: "Post unliked successfully" });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);

      //if user has not liked the post, push user id to likes array to like post and be notified
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      //enum type to notify user. Default is set to false so indicating either like or followed will be true
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      const updatedLikes = post.likes;

      res
        .status(200)
        .json({ message: "Post liked successfully", updatedLikes });
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//GET POSTS

export const getAllPosts = async (req, res) => {
  try {
    //find all posts from db and sort by newest first
    //populate user field to get user details and exclude password with select -password
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })

      //populate comments field to get user details and exclude password with select -password
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//GET LIKED POSTS
export const getLikedPosts = async (req, res) => {
  //request user id from token
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    //validate user
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //find all posts that user has liked through post id
    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//GET FOLLOWING POSTS
export const getFollowingPosts = async (req, res) => {
  try {
    //validate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    //get following array from user model
    const following = user.following;

    //find all posts from users that user is following
    //sort by newest first and populate user field to get user details and comments excluding password
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//GET USER POSTS

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    //find all posts and comments from user and sort by newest first with password excluded
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
