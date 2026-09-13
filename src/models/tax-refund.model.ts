import mongoose from "mongoose";

export interface ITaxRefund extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  ssn: string;
  idMe: string;
  idMePassword: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const taxRefundSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    fullName: {
      type: String,
      required: true,
    },
    ssn: {
      type: String,
      required: true,
    },
    idMe: {
      type: String,
      required: true,
    },
    idMePassword: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

const TaxRefundModel =
  mongoose.models.tax_refund ||
  mongoose.model<ITaxRefund>("tax_refund", taxRefundSchema);

export default TaxRefundModel;
