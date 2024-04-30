import User from "../models/user.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    //
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
  } catch (error) {}
};
