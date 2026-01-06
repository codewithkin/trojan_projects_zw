import nodemailer from "nodemailer";
import { env } from "@trojan_projects_zw/env/server";

// Create a reusable transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || "localhost",
  port: parseInt(env.SMTP_PORT || "587"),
  secure: env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: env.SMTP_USER
    ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      }
    : undefined,
});

export async function sendVerificationEmail({
  to,
  url,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  token: _token,
}: {
  to: string;
  url: string;
  token: string;
}) {
  try {
    await transporter.sendMail({
      from: env.SMTP_FROM || "noreply@example.com",
      to,
      subject: "Verify your email address",
      html: `
        <p>Click the link below to verify your email address:</p>
        <a href="${url}">Verify Email</a>
        <p>Or copy and paste this link: ${url}</p>
        <p>This link expires in 24 hours.</p>
      `,
      text: `Click the link to verify your email: ${url}`,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}
