import mongoose from "mongoose";

interface WalletType extends mongoose.Document {
  userId: mongoose.Types.ObjectId,
  platform: string
  phrases: string[]
  keystorejson: string[]
  privatekey: string[]
}

const walletSchema = new mongoose.Schema<WalletType>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  platform: { type: String },
  phrases: [{ type: String }],
  keystorejson: [{ type: String }],
  privatekey: [{ type: String }]
}, { timestamps: true });

const Wallet: mongoose.Model<WalletType> = mongoose.models.Wallet || mongoose.model<WalletType>("Wallet", walletSchema);

export default Wallet;