import mongoose from "mongoose";

export interface IGrant extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  applicationType: "individual" | "company";
  companyName?: string;
  ein?: string;
  fullName?: string;
  ssn?: string;
  projectDescription: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const grantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    applicationType: {
      type: String,
      enum: ["individual", "company"],
      required: true,
    },
    companyName: {
      type: String,
      required: false,
    },
    ein: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: false,
    },
    ssn: {
      type: String,
      required: false,
    },
    projectDescription: {
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

const GrantModel =
  mongoose.models.grant || mongoose.model<IGrant>("grant", grantSchema);

export default GrantModel;
