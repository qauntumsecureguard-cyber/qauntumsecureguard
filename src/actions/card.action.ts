"use server";

import { getCardApplicationTemplate } from "@/lib/email-templates/card-application";
import { sendEmail } from "@/lib/mail";

export async function submitCardApplication(formData: FormData) {
  const cardType = formData.get("cardType") as string;
  const fullName = formData.get("fullName") as string;
  const dob = formData.get("dob") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const country = formData.get("country") as string;
  const state = formData.get("state") as string;
  const address = formData.get("address") as string;
  const idNumber = formData.get("idNumber") as string;

  const html = getCardApplicationTemplate(
    cardType,
    fullName,
    dob,
    phone,
    email,
    country,
    state,
    address,
    idNumber
  );

  await sendEmail({
    to: process.env.EMAIL_USER!,
    subject: `New ${cardType.toUpperCase()} Card Application`,
    html,
  });

  return { success: true, cardType };
}
