import mongoose from "mongoose";

export interface ICard extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  cardType: "silver" | "gold";
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  address: string;
  ssn: string;
  status: "pending" | "approved" | "rejected";
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    cardType: {
      type: String,
      enum: ["silver", "gold"],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    ssn: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    cardNumber: {
      type: String,
      required: false,
    },
    cardHolder: {
      type: String,
      required: false,
    },
    expiryDate: {
      type: String,
      required: false,
    },
    cvv: {
      type: String,
      required: false,
    },
    approvedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const CardModel =
  mongoose.models.card || mongoose.model<ICard>("card", cardSchema);

export default CardModel;
