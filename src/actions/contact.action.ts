"use server";

import { sendEmail } from "@/lib/mail";

export async function submitContactForm(formData: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      return { success: false, error: "Please fill in all fields." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    // Send email to admin / support
    const targetEmail = process.env.EMAIL_USER || "maximumprofitinvestmentcompany@gmail.com";

    await sendEmail({
      to: targetEmail,
      subject: `New Contact Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0284c7;">New Contact Message Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
          <p><strong>Message:</strong></p>
          <p style="background: #f4f4f5; padding: 15px; rounded: 8px; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}
