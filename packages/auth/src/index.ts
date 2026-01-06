import { expo } from "@better-auth/expo";
import prisma from "@trojan_projects_zw/db";
import { env } from "@trojan_projects_zw/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendVerificationEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    env.CORS_ORIGIN, 
    "http://localhost:3001", // Web dev
    "http://10.255.235.15:3001", // Web on network
    "mybettertapp://", 
    "exp://", 
    "trojan_projects_zw://",
    "http://localhost:8081", // Expo dev server
    "http://10.255.235.15:8081", // Expo on network
  ],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, _request) => {
      void sendVerificationEmail({
        to: user.email,
        url,
        token,
      });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [expo()],
});

