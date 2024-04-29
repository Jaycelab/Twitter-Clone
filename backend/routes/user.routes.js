import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();
//4 methods to be used in user.routes.js with protectRoute middleware
//gets user profile
router.get("/profile/:username", protectRoute, getUserProfile);
//gets suggested users
router.get("/suggested", protectRoute, getSuggestedUsers);
//follows or unfollows user
router.post("/follow/:id", protectRoute, followUnfollowUser);

//updates user profile
//router.post("/update", protectRoute, updateUser);

export default router;
