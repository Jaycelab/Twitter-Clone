import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    //find all notifications for the user and display the user and profile image
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "user profileImg",
    });
    //update all notifications to read
    await Notification.updateMany(
      {
        to: userId,
      },
      { read: true }
    );

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications function ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    //delete all notifications for the user
    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted" });
  } catch (error) {
    console.log("Error in deleteNotifications function ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    const notification = await Notification.findById(notificationId); //find the notification

    //check if the notification exists
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this notification" });
    }
    //delete the notification
    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: "Notification deleted succesfully" });
  } catch (error) {
    console.log("Error in deleteNotification function ", error.message);
    res.status(500).json({ message: error.message });
  }
};
