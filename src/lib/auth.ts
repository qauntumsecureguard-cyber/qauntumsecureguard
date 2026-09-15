import { betterAuth } from "better-auth";
import mongoose from "mongoose";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import connectToDb from "@/config/connectToDb";
import { sendEmail } from "./mail";
import { getEmailVerificationTemplate } from "./email-templates/email-verification";
import { getResetPasswordTemplate } from "./email-templates/reset-password";
import { getPasswordChangeConfirmationTemplate } from "./email-templates/password-change-confirmation";
import { getWelcomeTemplate } from "./email-templates/welcome";
import { getSignUpBonusTemplate } from "./email-templates/signup-bonus";
import { createNotification } from "@/actions/notification.action";
import { NotificationCategory } from "@/constants";
import { headers } from "next/headers";
import { recordUserGeo } from "./geo";

const mongoDb = await connectToDb();

export const auth = betterAuth({
  database: mongodbAdapter(mongoDb),
  user: {
    additionalFields: {
      ipAddress: {
        type: "string",
        required: false,
        defaultValue: ""
      },
      country: {
        type: "string",
        required: false,
        defaultValue: ""
      },
      firstName: {
        type: "string",
        required: false,
        defaultValue: ""
      },
      lastName: {
        type: "string",
        required: false,
        defaultValue: ""
      },
      userId: {
        type: "string",
        required: false,
        defaultValue: ""
      },
      mobileNumber: {
        type: "string",
        required: false,
        defaultValue: ""
      },
      kyc: {
        type: "json",
        defaultValue: {
          status: "none",
          image: "",
          type: ""
        }
      },

      silverCardSubmitted: {
        type: "boolean",
        required: false
      },
      goldCardSubmitted: {
        type: "boolean",
        required: false
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "user" as "admin" | "user"
      },
      coins: {
        type: "string",
        required: true,
        defaultValue: JSON.stringify({
          BTC: {
            balance: 0,
          },
          "USDT_TRC20": {
            balance: 2,
            network: "TRC20"
          },
          ADA: {
            balance: 0,
          },
          XLM: {
            balance: 0,
          },
          XRP: {
            balance: 0,
          },
          DOGE: {
            balance: 0,
          },
          SOL: {
            balance: 0,
          },
          XAU: {
            balance: 0,
          },
          XAG: {
            balance: 0,
          },
          XPT: {
            balance: 0,
          },
          XPD: {
            balance: 0,
          }
        }),
      },
      walletStatus: {
        type: "string",
        required: true
      }
    }
  },
  emailVerification: {
    sendOnSignIn: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email - Qauntum Secure Guard",
        html: getEmailVerificationTemplate(user.name, url)
      })
    },
    afterEmailVerification: async (user) => {
      try {
        await createNotification({
          userId: user.id,
          type: NotificationCategory.RECEIVE,
          title: "Welcome Bonus Received",
          description: "You have received a $2 USDT welcome bonus for signing up!",
          to: "USDT",
          toAmount: 2
        });
      } catch (error) {
        console.error("Failed to create welcome bonus notification:", error);
      }

      if (user.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: "Welcome to Qauntum Secure Guard! 🚀",
            html: getWelcomeTemplate(user.name || "Valued Member"),
          });
        } catch (error) {
          console.error("Failed to send welcome email:", error);
        }

        try {
          await sendEmail({
            to: process.env.EMAIL_USER!,
            subject: "New User Registration",
            html: `
              <h1>New User Registered</h1>
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
            `
          });
        } catch (error) {
          console.error("Failed to send new registration email:", error);
        }

        try {
          await sendEmail({
            to: user.email,
            subject: "🎉 You've Received a 2.00 USDT Sign-Up Bonus!",
            html: getSignUpBonusTemplate(user.name || "Valued Member"),
          });
        } catch (error) {
          console.error("Failed to send sign-up bonus email:", error);
        }
      }
    },
  },
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password - Qauntum Secure Guard",
        html: getResetPasswordTemplate(user.name, url)
      })
    },
    onPasswordReset: async (data) => {
      await sendEmail({
        to: data.user.email,
        subject: "Your password has been changed",
        html: getPasswordChangeConfirmationTemplate(data.user.name)
      })
    },
  },
  deleteUser: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const reqHeaders = await headers();
            await recordUserGeo(user.id, reqHeaders);
          } catch (error) {
            console.error("Failed to record geo on signup:", error);
          }
        }
      }
    },
    session: {
      create: {
        after: async (session) => {
          try {
            const reqHeaders = await headers();
            await recordUserGeo(session.userId, reqHeaders);
          } catch (error) {
            console.error("Failed to record geo on session create:", error);
          }
        }
      }
    }
  },
  plugins: [
    nextCookies(),
    admin()
  ]
});

export type User = typeof auth.$Infer.Session["user"];