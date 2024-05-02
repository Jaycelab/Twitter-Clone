import express from "express";
import {
  getMe,
  signup,
  login,
  logout,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

//protectRoute is a middleware to check if user is logged in. Calls getMe if everything is completed
router.get("/me", protectRoute, getMe);

//signup checks user validation and creates user to database and send as a response back to client Also hashes password and generates token
//login checks if user exists and password is correct
//logout clears cookie
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
