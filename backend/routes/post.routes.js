import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost } from "../controllers/post.controller.js";

const router = express.Router();

//create post, delete post, like unlike post, comment on post
//***********************************************************/

router.post("/create", protectRoute, createPost);
//router.delete("/create", protectRoute, deletePost);
//router.post("/like/:id", protectRoute, likeUnlikePost);
//router.comment("/comment/:id", protectRoute, commentOnPost);

export default router;
