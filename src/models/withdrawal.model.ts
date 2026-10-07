import mongoose from "mongoose";

export interface IWithdrawal extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  coin: string;
  network: string;
  amount: number;
  recipientAddress: string;
  txHash: string;
  usdValue: number;
  fee: number;
  status: "pending" | "approved" | "completed" | "rejected";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    coin: { type: String, required: true },
    network: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    recipientAddress: { type: String, required: true },
    txHash: { type: String, required: true, unique: true, index: true },
    usdValue: { type: Number, required: true, default: 0 },
    fee: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "rejected"],
      default: "pending",
      required: true,
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

const WithdrawalModel =
  mongoose.models.withdrawal ||
  mongoose.model<IWithdrawal>("withdrawal", withdrawalSchema);

export default WithdrawalModel;
