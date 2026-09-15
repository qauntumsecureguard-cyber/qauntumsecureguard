"use server";

import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      return mongoose.connection.db;
    }

    if (mongoose.connection.readyState === 1 && mongoose.connection.client) {
      return mongoose.connection.client.db();
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    const database = mongoose.connection.db ?? mongoose.connection.client?.db();

    if (!database) {
      throw new Error("MongoDB database is not initialized.");
    }

    console.log("Connected to MongoDB");
    return database;
  } catch (error) {
    console.log("Database connection error:", error);
    throw error;
  }
};

export default connectToDb;