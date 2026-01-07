import { z } from "zod";

// Request schemas
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  code: z.string().min(1, "Reset code is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const verifyEmailSchema = z.object({
  code: z.string().min(1, "Verification code is required"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

// Types
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "user" | "staff" | "support";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface SessionData {
  user: AuthUser;
  session: AuthSession;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  session?: AuthSession;
  token?: string;
  error?: string;
}
