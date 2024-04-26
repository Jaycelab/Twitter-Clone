import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    //regular expressions to check if user email is passed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    //finding duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    //finding duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    //hashing password
    // 1234567 => lksj235asd_@adkjl;asf
    //makes pw unreadable
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating new user

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    //saving new user as a response
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }

    //catch
  } catch (error) {
    console.log("Error on signup", error.message);

    res.status(500).json({ error: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  res.json({
    data: "You hit the login endpoint",
  });
};

export const logout = async (req, res) => {
  res.json({
    data: "You hit the logout endpoint",
  });
};
