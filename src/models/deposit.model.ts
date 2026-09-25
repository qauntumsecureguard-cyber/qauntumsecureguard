import mongoose from "mongoose";

export interface IDeposit extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  coin: string;
  network: string;
  amount: number;
  usdValue: number;
  proofUrl: string;
  status: "draft" | "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const depositSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    coin: { type: String, required: true },
    network: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    usdValue: { type: Number, required: true, min: 0 },
    proofUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
      required: true,
    },
  },
  { timestamps: true }
);

const DepositModel =
  mongoose.models.deposit || mongoose.model<IDeposit>("deposit", depositSchema);

export default DepositModel;