import express from "express";
import dotenv from "dotenv";
// ensure to add .js since type is set to module
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();

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
//function connectMongoDB to connect to database once server is running
//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
