import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  from: {
    type: String,
    required: false
  },
  to: {
    type: String,
    required: false
  },
  fromAmount: {
    type: Number,
    required: false
  },
  toAmount: {
    type: Number,
    required: false
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true });

const NotificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema)

export default NotificationModel;