import express from "express";
import dotenv from "dotenv";
// ensure to add .js since type is set to module
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

//chaning v2 to cloudinary for readability
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

//middleware to parse req.body or foreign data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse form data (urlencoded  )

//middleware to parse cookies
app.use(cookieParser());

//if request API auth , run avaialble router methods (post, get, etc) to run
// available function (getMe, signup, login, logout etc)

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

//function connectMongoDB to connect to database once server is running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
