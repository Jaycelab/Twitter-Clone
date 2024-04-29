import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
  //requesting username from params
  const { username } = req.params;

  try {
    //overall get user profile from params and returning as a response back
    //find user by username and return user object without password
    const user = await User.findOne({ username }).select("-password");

    //if user not found return error
    if (!user) return res.status(404).json({ message: "User not found" });

    //else return user as a response
    res.status(200).json(user);
  } catch (error) {
    // catch error
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  // getting id by params
  try {
    const { id } = req.params;
    //two different users to be modified. User to follow and unfollow (modify)
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    //! user to follow themselves. not a message but an error
    //check is converted to string to not compare object to object
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    //check if either user to modify current user is found or not
    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });
    //checks if user is following or not by including id
    const isFollowing = currentUser.following.includes(id);

    //
    if (isFollowing) {
      //Unfollowing user using findbyidandupdate pull method
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

      //pull current user id of follower to current user array
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      //send notification to the user
      // TODO: returns the id of the user as a response
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //if user is following then unfollow using findbyidandupdate
      //push method to followers with id to current user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

      //updating current user object with id of follower to following array
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // Send notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();

      // TODO: returns the id of the user as a respone
      res.status(200).json({ message: "User followed successfully" });
    }

    //error in unfollow / follow user
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

//get suggested users removing current user along with users already following
export const getSuggestedUsers = async (req, res) => {
  try {
    const userID = req.user._id;

    //find user by id and select following
    const usersFollowedByMe = await User.findById(userID).select("following");

    //aggregate to get users not following and not current user
    const users = await User.aggregate([
      {
        $match: {
          //not equal to current user id
          _id: { $ne: userID },
        },
      },
      //sample 10 users
      { $sample: { size: 10 } },
    ]);

    //filter users not following and not current user
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    //return 4 suggested users
    const suggestedUsers = filteredUsers.slice(0, 4);

    //for each user, set password to null
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    //error in getting suggested users
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
