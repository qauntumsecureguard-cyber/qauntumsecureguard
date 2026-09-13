import connectToDb from "@/config/connectToDb";
import mongoose from "mongoose";

export function extractIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const clientIp = headers.get("x-client-ip");
  if (clientIp) return clientIp.trim();

  return "";
}

export function countryCodeToName(code: string): string {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code.toUpperCase().trim()) || code;
  } catch {
    return code;
  }
}

export function getCountryFromHeaders(headers: Headers): string {
  const vercelCountry = headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    return countryCodeToName(vercelCountry);
  }

  const cfCountry = headers.get("cf-ipcountry");
  if (cfCountry) {
    return countryCodeToName(cfCountry);
  }

  const countryCode = headers.get("x-country-code");
  if (countryCode) {
    return countryCodeToName(countryCode);
  }

  return "";
}

export async function lookupCountryByIp(ip: string): Promise<string> {
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return "Localhost";
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data.status === "success" && data.country) {
        return data.country;
      }
    }
  } catch {
    // fallback
  }

  return "Unknown";
}

export async function resolveUserGeo(headers: Headers): Promise<{ ip: string; country: string }> {
  const ip = extractIpFromHeaders(headers);
  let country = getCountryFromHeaders(headers);

  if (!country && ip) {
    country = await lookupCountryByIp(ip);
  }

  const finalIp = ip || (country === "Localhost" ? "127.0.0.1" : "");
  const finalCountry = country || (ip === "127.0.0.1" || ip === "::1" ? "Localhost" : "");

  return {
    ip: finalIp,
    country: finalCountry,
  };
}

export async function recordUserGeo(userId: string, headers: Headers) {
  try {
    const { ip, country } = await resolveUserGeo(headers);
    if (!ip && !country) return;

    await connectToDb();
    const db = mongoose.connection.db;
    if (!db) return;

    const filter = mongoose.Types.ObjectId.isValid(userId)
      ? { $or: [{ _id: new mongoose.Types.ObjectId(userId) }, { id: userId }, { _id: userId as any }] }
      : { $or: [{ id: userId }, { _id: userId as any }] };

    const updateFields: Record<string, any> = {
      lastSeenAt: new Date(),
    };
    if (ip) updateFields.ipAddress = ip;
    if (country) updateFields.country = country;

    await db.collection("user").updateOne(filter, { $set: updateFields });
  } catch (err) {
    console.error("Failed to record user geo:", err);
  }
}
