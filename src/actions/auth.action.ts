"use server";

import mongoose from "mongoose";
import connectToDb from "@/config/connectToDb";

await connectToDb();

const normalizeUserId = (value: string) => value.trim();

const getUserCollection = () => {
  const db = mongoose.connection.db ?? mongoose.connection.client?.db();
  return db?.collection("user");
};

export async function isUserIdAvailable(userId: string): Promise<{ available: boolean; error?: string }> {
  const normalizedUserId = normalizeUserId(userId);

  if (!normalizedUserId) {
    return { available: false, error: "User ID is required." };
  }

  if (!/^[A-Za-z0-9]+$/.test(normalizedUserId)) {
    return { available: false, error: "User ID must be alphanumeric." };
  }

  const userCollection = getUserCollection();

  if (!userCollection) {
    return { available: false, error: "Database is unavailable." };
  }

  const existingUser = await userCollection.findOne({ userId: normalizedUserId });

  return {
    available: !existingUser,
    error: existingUser ? "This User ID is already taken." : undefined,
  };
}

export async function resolveLoginEmail(identifier: string): Promise<{ success: boolean; email?: string; error?: string }> {
  const normalizedIdentifier = identifier.trim();

  if (!normalizedIdentifier) {
    return { success: false, error: "User ID or email is required." };
  }

  const userCollection = getUserCollection();

  if (!userCollection) {
    return { success: false, error: "Database is unavailable." };
  }

  const query = normalizedIdentifier.includes("@")
    ? { email: normalizedIdentifier.toLowerCase() }
    : { userId: normalizedIdentifier };

  const existingUser = await userCollection.findOne(query);

  if (!existingUser?.email) {
    return { success: false, error: "No account found for this User ID or email." };
  }

  return {
    success: true,
    email: String(existingUser.email),
  };
}
