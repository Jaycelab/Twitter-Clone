import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    //from is the user who will send the notification
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //to is the user who will receive the notification
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //two differnet values (arr) for notification type
    //enum is used to restrict the values to only two
    //follow and like
    type: {
      type: String,
      required: true,
      enum: ["follow", "like"],
    },
    //read is a boolean value to check if the notification is read or not
    read: {
      type: Boolean,
      default: false,
    },
  },
  //timestamps is used to store the time of creation and updation of the notification
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
