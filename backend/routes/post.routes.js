import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getUserPosts,
  likeUnlikePost,
  getLikedPosts,
  getFollowingPosts,
  commentOnPost,
} from "../controllers/post.controller.js";

const router = express.Router();

//create post, delete post, like unlike post, comment on post
//delete post by id to filter previous posts
//***********************************************************/

//main routes for post
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);

//data fetch for post
router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);

export default router;
