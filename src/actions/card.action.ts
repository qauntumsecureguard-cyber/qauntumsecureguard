"use server";

import connectToDb from "@/config/connectToDb";
import { auth } from "@/lib/auth";
import CardModel from "@/models/card.model";
import mongoose from "mongoose";
import { headers } from "next/headers";
import { createNotification } from "./notification.action";
import { NotificationCategory, PRECIOUS_METALS, METAL_PRICES } from "@/constants";
import { sendEmail } from "@/lib/mail";
import { getCardApplicationTemplate } from "@/lib/email-templates/card-application";
import { getCardStatusUpdateTemplate } from "@/lib/email-templates/card-status-update";
import { getAssetsData } from "@/lib/assets";

// Helper to generate 16-digit card number, expiry date (4 years), and CVV
function generateCardDetails(fullName: string) {
  // Generate 16 digits formatted in 4 blocks (e.g. 4532 8921 7843 9201)
  const prefix = "4"; // Visa-style prefix
  let remainingDigits = "";
  for (let i = 0; i < 15; i++) {
    remainingDigits += Math.floor(Math.random() * 10).toString();
  }
  const fullNum = prefix + remainingDigits;
  const formattedCardNumber = fullNum.match(/.{1,4}/g)?.join(" ") || fullNum;

  // 4 years from now expiration
  const now = new Date();
  const expMonth = String(now.getMonth() + 1).padStart(2, "0");
  const expYear = String((now.getFullYear() + 4) % 100).padStart(2, "0");
  const expiryDate = `${expMonth}/${expYear}`;

  // 3-digit CVV
  const cvv = String(Math.floor(100 + Math.random() * 900));

  return {
    cardNumber: formattedCardNumber,
    cardHolder: (fullName || "CARDHOLDER").toUpperCase(),
    expiryDate,
    cvv,
  };
}

export async function submitCardApplication(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "User not authenticated" };
    }

    const cardType = (formData.get("cardType") as "silver" | "gold") || "silver";
    const fullName = formData.get("fullName") as string;
    const dob = formData.get("dob") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const country = formData.get("country") as string;
    const state = formData.get("state") as string;
    const address = formData.get("address") as string;
    const ssn = formData.get("ssn") as string;

    if (!fullName || !dob || !phone || !email || !country || !state || !address || !ssn) {
      return { error: "Please fill in all required fields." };
    }

    await connectToDb();

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Pre-generate card details ready for activation upon approval
    const cardDetails = generateCardDetails(fullName);

    const card = await CardModel.create({
      userId: userObjectId,
      cardType,
      fullName,
      dob,
      phone,
      email,
      country,
      state,
      address,
      ssn,
      status: "pending",
      cardNumber: cardDetails.cardNumber,
      cardHolder: cardDetails.cardHolder,
      expiryDate: cardDetails.expiryDate,
      cvv: cardDetails.cvv,
    });

    // In-app notification for user
    try {
      await createNotification({
        userId: session.user.id,
        type: NotificationCategory.KYC_UPDATE,
        title: `${cardType.toUpperCase()} Card Application Received`,
        description: `Your application for the ${cardType.toUpperCase()} Card is under review. Our team will verify your balance and account details shortly.`,
      });
    } catch (notifErr) {
      console.error("Failed to create submission notification:", notifErr);
    }

    // Email notification to Admin
    if (process.env.EMAIL_USER) {
      try {
        const html = getCardApplicationTemplate(
          cardType,
          fullName,
          dob,
          phone,
          email,
          country,
          state,
          address,
          ssn
        );

        await sendEmail({
          to: process.env.EMAIL_USER,
          subject: `New ${cardType.toUpperCase()} Card Application - ${fullName}`,
          html,
        });
      } catch (err) {
        console.error("Failed to send admin card notification email:", err);
      }
    }

    return {
      success: true,
      cardId: card._id.toString(),
      cardType,
    };
  } catch (error) {
    console.error("Error submitting card application:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to submit card application",
    };
  }
}

export async function getUserCards() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { cards: [], error: "User not authenticated" };
    }

    await connectToDb();

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const cards = await CardModel.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .lean();

    const formattedCards = cards.map((c) => ({
      id: (c._id as mongoose.Types.ObjectId).toString(),
      cardType: c.cardType,
      fullName: c.fullName,
      status: c.status,
      cardNumber: c.cardNumber || "",
      cardHolder: c.cardHolder || c.fullName,
      expiryDate: c.expiryDate || "",
      cvv: c.cvv || "",
      approvedAt: c.approvedAt ? c.approvedAt.toISOString() : null,
      submittedOn: new Date(c.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    return { cards: formattedCards, error: null };
  } catch (error) {
    console.error("Error fetching user cards:", error);
    return { cards: [], error: "Failed to fetch cards" };
  }
}

export async function getAllCardsAdmin() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return { cards: [], error: "Unauthorized access" };
    }

    await connectToDb();

    const cards = await CardModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    const { coinData, metalData } = await getAssetsData();
    // Fallback prices in case CoinGecko is rate-limited or down
    const FALLBACK_PRICES: Record<string, number> = {
      BTC: 97000, ETH: 3500, USDT: 1, ADA: 0.45, XLM: 0.12,
      XRP: 0.55, DOGE: 0.08, SOL: 145,
    };
    const priceMap: Record<string, number> = { ...FALLBACK_PRICES };
    for (const coin of coinData) {
      if (coin.price > 0) priceMap[coin.symbol] = coin.price;
    }
    for (const metal of metalData) {
      const p = metal.price || METAL_PRICES[metal.symbol] || 0;
      if (p > 0) priceMap[metal.symbol] = p;
    }

    const userMap = new Map<string, { email: string; name: string; estimatedBalance: number; coins: any; coinHoldings: { symbol: string; balance: number; usdValue: number }[] }>();
    try {
      const listOfUsers = await auth.api.listUsers({
        query: { limit: 200 },
        headers: await headers(),
      });
      if (listOfUsers?.users) {
        for (const u of listOfUsers.users) {
          let estimatedBalance = 0;
          let parsedCoins: Record<string, any> = {};
          const coinHoldings: { symbol: string; balance: number; usdValue: number }[] = [];

          try {
            parsedCoins = JSON.parse((u as any).coins || "{}");
            // Use a Map to merge holdings with the same base symbol
            const holdingsMap = new Map<string, { balance: number; usdValue: number }>();
            for (const [key, val] of Object.entries(parsedCoins)) {
              const coinObj = val as { balance?: number | string };
              const bal = Number(coinObj?.balance || 0);
              if (isNaN(bal) || bal <= 0) continue;

              // Strip network suffixes → USDT_SOLANA, USDT_TRC20 → USDT
              const baseSymbol = key.replace(/_(SOLANA|TRC20|ERC20|BEP20|BSC|MATIC|AVAX|ARBITRUM|OPTIMISM|BASE)$/i, "");
              const price = priceMap[baseSymbol] ?? (baseSymbol === "USDT" ? 1 : 0);
              const usdVal = bal * price;
              estimatedBalance += usdVal;

              const existing = holdingsMap.get(baseSymbol);
              if (existing) {
                existing.balance += bal;
                existing.usdValue += usdVal;
              } else {
                holdingsMap.set(baseSymbol, { balance: bal, usdValue: usdVal });
              }
            }
            for (const [symbol, data] of holdingsMap.entries()) {
              coinHoldings.push({ symbol, balance: data.balance, usdValue: data.usdValue });
            }
          } catch {
            // ignore
          }

          userMap.set(u.id, {
            email: u.email,
            name: u.name,
            estimatedBalance,
            coins: parsedCoins,
            coinHoldings,
          });
        }
      }
    } catch {
      // ignore
    }

    const formattedCards = cards.map((c) => {
      const userIdStr = c.userId ? c.userId.toString() : "";
      const userInfo = userMap.get(userIdStr);

      return {
        id: (c._id as mongoose.Types.ObjectId).toString(),
        userId: userIdStr,
        cardType: c.cardType,
        fullName: c.fullName,
        email: c.email || userInfo?.email || "",
        phone: c.phone,
        dob: c.dob,
        country: c.country,
        state: c.state,
        address: c.address,
        ssn: c.ssn,
        status: c.status,
        cardNumber: c.cardNumber || "",
        cardHolder: c.cardHolder || c.fullName,
        expiryDate: c.expiryDate || "",
        cvv: c.cvv || "",
        userAccountEmail: userInfo?.email || "",
        userAccountName: userInfo?.name || "",
        userEstimatedBalance: userInfo?.estimatedBalance || 0,
        coinHoldings: userInfo?.coinHoldings || [],
        approvedAt: c.approvedAt ? c.approvedAt.toISOString() : null,
        submittedOn: new Date(c.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
    });

    return { cards: formattedCards, error: null };
  } catch (error) {
    console.error("Error fetching all cards for admin:", error);
    return { cards: [], error: "Failed to fetch card requests" };
  }
}

export async function updateCardStatusAdmin(
  cardId: string,
  status: "approved" | "pending" | "rejected"
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized access" };
    }

    await connectToDb();

    const existingCard = await CardModel.findById(cardId);
    if (!existingCard) {
      return { error: "Card request not found" };
    }

    const updateData: any = { status };

    // If approving, make sure card number, expiry, CVV are set
    if (status === "approved") {
      updateData.approvedAt = new Date();
      if (!existingCard.cardNumber || !existingCard.expiryDate || !existingCard.cvv) {
        const generated = generateCardDetails(existingCard.fullName);
        updateData.cardNumber = existingCard.cardNumber || generated.cardNumber;
        updateData.cardHolder = existingCard.cardHolder || generated.cardHolder;
        updateData.expiryDate = existingCard.expiryDate || generated.expiryDate;
        updateData.cvv = existingCard.cvv || generated.cvv;
      }
    }

    const card = await CardModel.findByIdAndUpdate(cardId, updateData, {
      new: true,
    });

    if (!card) {
      return { error: "Failed to update card status" };
    }

    // In-app notification to user
    try {
      await createNotification({
        userId: card.userId.toString(),
        type: status === "approved" ? NotificationCategory.RECEIVE : NotificationCategory.KYC_UPDATE,
        title: `Card Application ${status === "approved" ? "Approved 🎉" : status.charAt(0).toUpperCase() + status.slice(1)}`,
        description:
          status === "approved"
            ? `Your ${card.cardType.toUpperCase()} Card is now ACTIVE! You can view your card number and virtual details in your Card Hub.`
            : `Your ${card.cardType.toUpperCase()} Card application status has been updated to ${status}.`,
      });
    } catch (notifErr) {
      console.error("Notification creation failed:", notifErr);
    }

    // Send email to applicant
    try {
      const applicantUser = (await auth.api.getUser({
        query: { id: card.userId.toString() },
        headers: await headers(),
      })) as any;

      const targetEmail = card.email || applicantUser?.email;
      if (targetEmail) {
        const subject =
          status === "approved"
            ? `🎉 Your Qauntum Secure Guard ${card.cardType.toUpperCase()} Card Has Been Approved!`
            : `Card Application Status Update - Qauntum Secure Guard`;

        await sendEmail({
          to: targetEmail,
          subject,
          html: getCardStatusUpdateTemplate({
            name: card.fullName || applicantUser?.name || "Valued Customer",
            cardType: card.cardType,
            cardNumber: card.cardNumber,
            expiryDate: card.expiryDate,
            status,
          }),
        });
      }
    } catch (emailErr) {
      console.error("Failed to send card status update email:", emailErr);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating card status:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update card status",
    };
  }
}
