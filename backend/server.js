import express from "express";
// ensure to add .js since type is set to module
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use("/api/auth", authRoutes);

app.listen(6900, () => {
  console.log("Server is running on port 6900");
});
