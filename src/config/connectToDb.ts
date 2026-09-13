"use server";

import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
}

export default connectToDb;