import nodemailer from "nodemailer";
import { env } from "@trojan_projects_zw/env/server";

// Email transporter (created lazily)
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  // Check if SMTP is configured
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
    console.warn("SMTP not configured. Emails will be logged to console.");
    // Return a mock transporter for development
    return {
      sendMail: async (options: nodemailer.SendMailOptions) => {
        console.log("=== EMAIL (not sent - SMTP not configured) ===");
        console.log("To:", options.to);
        console.log("Subject:", options.subject);
        console.log("HTML:", options.html);
        console.log("==============================================");
        return { messageId: "dev-" + Date.now() };
      },
    } as nodemailer.Transporter;
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || "587", 10),
    secure: env.SMTP_SECURE === "true",
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

const FROM_EMAIL = env.SMTP_FROM || "noreply@trojanprojects.com";
const APP_NAME = "Trojan Projects";
const APP_URL = env.CORS_ORIGIN || "http://localhost:3001";

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationCode: string
): Promise<void> {
  const verificationUrl = `${APP_URL}/verify-email?code=${verificationCode}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #0F1B4D; padding: 30px; text-align: center;">
                  <h1 style="color: #FFC107; margin: 0; font-size: 28px;">Trojan Projects</h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #0F1B4D; margin: 0 0 20px;">Welcome, ${name}!</h2>
                  <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                    Thank you for signing up for Trojan Projects. To complete your registration and start exploring our services, please verify your email address.
                  </p>
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${verificationUrl}" style="display: inline-block; background-color: #FFC107; color: #0F1B4D; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #777; font-size: 14px; line-height: 1.6; margin: 0 0 10px;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="color: #0F1B4D; font-size: 14px; word-break: break-all; margin: 0 0 20px;">
                    ${verificationUrl}
                  </p>
                  <p style="color: #999; font-size: 13px; margin: 0;">
                    This link will expire in 24 hours.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await getTransporter().sendMail({
    from: `"${APP_NAME}" <${FROM_EMAIL}>`,
    to: email,
    subject: "Verify your email address - Trojan Projects",
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetCode: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?code=${resetCode}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #0F1B4D; padding: 30px; text-align: center;">
                  <h1 style="color: #FFC107; margin: 0; font-size: 28px;">Trojan Projects</h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #0F1B4D; margin: 0 0 20px;">Password Reset Request</h2>
                  <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                    Hi ${name},
                  </p>
                  <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                    We received a request to reset your password. Click the button below to create a new password.
                  </p>
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetUrl}" style="display: inline-block; background-color: #FFC107; color: #0F1B4D; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset Password</a>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #777; font-size: 14px; line-height: 1.6; margin: 0 0 10px;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="color: #0F1B4D; font-size: 14px; word-break: break-all; margin: 0 0 20px;">
                    ${resetUrl}
                  </p>
                  <p style="color: #999; font-size: 13px; margin: 0 0 10px;">
                    This link will expire in 1 hour.
                  </p>
                  <p style="color: #999; font-size: 13px; margin: 0;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await getTransporter().sendMail({
    from: `"${APP_NAME}" <${FROM_EMAIL}>`,
    to: email,
    subject: "Reset your password - Trojan Projects",
    html,
  });
}

/**
 * Send team member invite email with login credentials
 */
export async function sendInviteEmail(
  email: string,
  name: string,
  role: string,
  password: string
): Promise<void> {
  const loginUrl = `${APP_URL}/login`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Trojan Projects</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #0F1B4D; padding: 30px; text-align: center;">
                  <h1 style="color: #FFC107; margin: 0; font-size: 28px;">Trojan Projects</h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #0F1B4D; margin: 0 0 20px;">Welcome to the Team!</h2>
                  <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                    Hi ${name},
                  </p>
                  <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                    You've been invited to join Trojan Projects as a <strong style="color: #0F1B4D;">${role}</strong>. Your account has been created and is ready to use.
                  </p>
                  
                  <!-- Credentials Box -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="color: #0F1B4D; font-weight: bold; margin: 0 0 15px; font-size: 14px;">Your Login Credentials:</p>
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 14px; width: 80px;">Email:</td>
                            <td style="padding: 8px 0; color: #0F1B4D; font-weight: bold; font-size: 14px;">${email}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 14px;">Password:</td>
                            <td style="padding: 8px 0; color: #0F1B4D; font-weight: bold; font-size: 14px; font-family: monospace; background-color: #fff; padding-left: 10px; border-radius: 4px;">${password}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #d63384; font-size: 14px; line-height: 1.6; margin: 0 0 20px; padding: 10px; background-color: #fff3f8; border-radius: 6px; border-left: 4px solid #d63384;">
                    <strong>Important:</strong> We recommend changing your password after your first login for security.
                  </p>
                  
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${loginUrl}" style="display: inline-block; background-color: #FFC107; color: #0F1B4D; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Login to Your Account</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #999; font-size: 13px; margin: 0;">
                    If you have any questions, please contact your administrator.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await getTransporter().sendMail({
    from: `"${APP_NAME}" <${FROM_EMAIL}>`,
    to: email,
    subject: "Welcome to Trojan Projects - Your Account Details",
    html,
  });
}
