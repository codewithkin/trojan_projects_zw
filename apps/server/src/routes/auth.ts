import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";
import { 
  signUpSchema, 
  signInSchema, 
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  changePasswordSchema,
  type AuthResponse, 
  type AuthUser 
} from "../lib/auth/types";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import { createJWT, generateSessionToken, verifyJWT, extractBearerToken } from "../lib/auth/jwt";
import { generateToken } from "../lib/auth/jwt";
import { sendVerificationEmail, sendPasswordResetEmail, sendInviteEmail } from "../lib/email";
import { hasAdminAccess, hasFullAdminAccess } from "../config/admins";
import { notifyUserCreated, notifyUserInvited, notifyRoleUpdated } from "../lib/notifications";

const authRoute = new Hono();

// Helper to convert DB user to AuthUser
function toAuthUser(user: any): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// Sign Up
authRoute.post("/sign-up", async (c) => {
  try {
    const body = await c.req.json();
    const validation = signUpSchema.safeParse(body);

    if (!validation.success) {
      return c.json<AuthResponse>({
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input",
      }, 400);
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json<AuthResponse>({
        success: false,
        error: "User with this email already exists",
      }, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = generateToken(16);
    const user = await db.user.create({
      data: {
        id: userId,
        name,
        email,
        emailVerified: false,
        role: "user",
      },
    });

    // Create account with password
    const accountId = generateToken(16);
    await db.account.create({
      data: {
        id: accountId,
        accountId: email,
        providerId: "credentials",
        userId: user.id,
        password: hashedPassword,
      },
    });

    // Create session
    const sessionId = generateToken(16);
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await db.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        token: sessionToken,
        expiresAt,
        ipAddress: c.req.header("x-forwarded-for") || "unknown",
        userAgent: c.req.header("user-agent") || "unknown",
      },
    });

    // Create JWT
    const jwt = await createJWT(user.id, session.id);

    // Create verification token and send email
    try {
      const verificationId = generateToken(16);
      const verificationCode = generateToken(32);
      await db.verification.create({
        data: {
          id: verificationId,
          identifier: email,
          value: verificationCode,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });
      await sendVerificationEmail(email, name, verificationCode);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail signup if email fails
    }

    // Create notification for admin dashboard
    try {
      await notifyUserCreated({ id: user.id, name: user.name, email: user.email });
    } catch (notifyError) {
      console.error("Failed to create notification:", notifyError);
    }

    return c.json<AuthResponse>({
      success: true,
      user: toAuthUser(user),
      session: {
        id: session.id,
        userId: user.id,
        token: sessionToken,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      },
      token: jwt,
    }, 201);
  } catch (error) {
    console.error("Sign up error:", error);
    return c.json<AuthResponse>({
      success: false,
      error: "Failed to create account",
    }, 500);
  }
});

// Sign In
authRoute.post("/sign-in", async (c) => {
  try {
    const body = await c.req.json();
    const validation = signInSchema.safeParse(body);

    if (!validation.success) {
      return c.json<AuthResponse>({
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input",
      }, 400);
    }

    const { email, password } = validation.data;

    // Find user
    const user = await db.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { providerId: "credentials" },
        },
      },
    });

    if (!user || !user.accounts[0]?.password) {
      return c.json<AuthResponse>({
        success: false,
        error: "Invalid email or password",
      }, 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.accounts[0].password);
    if (!isValid) {
      return c.json<AuthResponse>({
        success: false,
        error: "Invalid email or password",
      }, 401);
    }

    // Create session
    const sessionId = generateToken(16);
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await db.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        token: sessionToken,
        expiresAt,
        ipAddress: c.req.header("x-forwarded-for") || "unknown",
        userAgent: c.req.header("user-agent") || "unknown",
      },
    });

    // Create JWT
    const jwt = await createJWT(user.id, session.id);

    return c.json<AuthResponse>({
      success: true,
      user: toAuthUser(user),
      session: {
        id: session.id,
        userId: user.id,
        token: sessionToken,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      },
      token: jwt,
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return c.json<AuthResponse>({
      success: false,
      error: "Failed to sign in",
    }, 500);
  }
});

// Get Session
authRoute.get("/session", async (c) => {
  try {
    const authHeader = c.req.header("Authorization") ?? null;
    const token = extractBearerToken(authHeader as string | null);

    if (!token) {
      return c.json<AuthResponse>({
        success: false,
        error: "No token provided",
      }, 401);
    }

    // Verify JWT
    const payload = await verifyJWT(token);
    if (!payload) {
      return c.json<AuthResponse>({
        success: false,
        error: "Invalid or expired token",
      }, 401);
    }

    // Find session
    const session = await db.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return c.json<AuthResponse>({
        success: false,
        error: "Session expired",
      }, 401);
    }

    return c.json<AuthResponse>({
      success: true,
      user: toAuthUser(session.user),
      session: {
        id: session.id,
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    console.error("Get session error:", error);
    return c.json<AuthResponse>({
      success: false,
      error: "Failed to get session",
    }, 500);
  }
});

// Sign Out
authRoute.post("/sign-out", async (c) => {
  try {
    const authHeader = c.req.header("Authorization") ?? null;
    const token = extractBearerToken(authHeader as string | null);

    if (!token) {
      return c.json<AuthResponse>({
        success: true,
      });
    }

    // Verify JWT
    const payload = await verifyJWT(token);
    if (payload) {
      // Delete session
      await db.session.delete({
        where: { id: payload.sessionId },
      }).catch(() => {}); // Ignore if already deleted
    }

    return c.json<AuthResponse>({
      success: true,
    });
  } catch (error) {
    console.error("Sign out error:", error);
    return c.json<AuthResponse>({
      success: true, // Still return success for sign out
    });
  }
});

// Verify Email
authRoute.post("/verify-email", async (c) => {
  try {
    const body = await c.req.json();
    const validation = verifyEmailSchema.safeParse(body);

    if (!validation.success) {
      return c.json<AuthResponse>({
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input",
      }, 400);
    }

    const { code } = validation.data;

    // Find verification record
    const verification = await db.verification.findFirst({
      where: {
        value: code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      return c.json<AuthResponse>({
        success: false,
        error: "Invalid or expired verification code",
      }, 400);
    }

    // Update user's email verification status
    const user = await db.user.update({
      where: { email: verification.identifier },
      data: { emailVerified: true },
    });

    // Delete the verification record
    await db.verification.delete({
      where: { id: verification.id },
    });

    return c.json<AuthResponse>({
      success: true,
      user: toAuthUser(user),
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return c.json<AuthResponse>({
      success: false,
      error: "Failed to verify email",
    }, 500);
  }
});

// Resend Verification Email
authRoute.post("/resend-verification", async (c) => {
  try {
    const body = await c.req.json();
    const validation = resendVerificationSchema.safeParse(body);

    if (!validation.success) {
      return c.json<AuthResponse>({
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input",
      }, 400);
    }

    const { email } = validation.data;

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return c.json<AuthResponse>({
        success: true,
      });
    }

    if (user.emailVerified) {
      return c.json<AuthResponse>({
        success: false,
        error: "Email is already verified",
      }, 400);
    }

    // Delete any existing verification tokens for this email
    await db.verification.deleteMany({
      where: { identifier: email },
    });

    // Create new verification token
    const verificationId = generateToken(16);
    const verificationCode = generateToken(32);
    await db.verification.create({
      data: {
        id: verificationId,
        identifier: email,
        value: verificationCode,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send email
    await sendVerificationEmail(email, user.name, verificationCode);

    return c.json<AuthResponse>({
      success: true,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return c.json<AuthResponse>({
      success: false,
      error: "Failed to resend verification email",
    }, 500);
  }
});

// Forgot Password
authRoute.post("/forgot-password", async (c) => {
  try {
    const body = await c.req.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return c.json<AuthResponse>({
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input",
      }, 400);
    }

    const { email } = validation.data;

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists - return success anyway
      return c.json<AuthResponse>({
        success: true,
      });
    }

    // Delete any existing password reset tokens for this email
    await db.verification.deleteMany({
      where: { 
        identifier: `password-reset:${email}`,
      },
    });

    // Create password reset token
    const resetId = generateToken(16);
    const resetCode = generateToken(32);
    await db.verification.create({
      data: {
        id: resetId,
        identifier: `password-reset:${email}`,
        value: resetCode,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send email
    await sendPasswordResetEmail(email, user.name, resetCode);

    return c.json<AuthResponse>({
      success: true,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return c.json<AuthResponse>({
      success: false,
      error: "Failed to send password reset email",
    }, 500);
  }
});

// Reset Password
authRoute.post("/reset-password", async (c) => {
  try {
    const body = await c.req.json();
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return c.json<AuthResponse>({
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input",
      }, 400);
    }

    const { code, password } = validation.data;

    // Find verification record
    const verification = await db.verification.findFirst({
      where: {
        value: code,
        identifier: { startsWith: "password-reset:" },
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      return c.json<AuthResponse>({
        success: false,
        error: "Invalid or expired reset code",
      }, 400);
    }

    // Extract email from identifier
    const email = verification.identifier.replace("password-reset:", "");

    // Find user
    const user = await db.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { providerId: "credentials" },
        },
      },
    });

    if (!user || !user.accounts[0]) {
      return c.json<AuthResponse>({
        success: false,
        error: "User not found",
      }, 404);
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update account password
    await db.account.update({
      where: { id: user.accounts[0].id },
      data: { password: hashedPassword },
    });

    // Delete the verification record
    await db.verification.delete({
      where: { id: verification.id },
    });

    // Delete all sessions for this user (force re-login)
    await db.session.deleteMany({
      where: { userId: user.id },
    });

    return c.json<AuthResponse>({
      success: true,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return c.json<AuthResponse>({
      success: false,
      error: "Failed to reset password",
    }, 500);
  }
});

// Change Password (authenticated users)
authRoute.post("/change-password", async (c) => {
  try {
    // Get the authorization token
    const authHeader = c.req.header("Authorization") ?? null;
    const token = extractBearerToken(authHeader);

    if (!token) {
      return c.json<AuthResponse>({
        success: false,
        error: "Authentication required",
      }, 401);
    }

    // Verify the token
    const decoded = await verifyJWT(token);
    if (!decoded) {
      return c.json<AuthResponse>({
        success: false,
        error: "Invalid or expired token",
      }, 401);
    }

    const body = await c.req.json();
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      return c.json<AuthResponse>({
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input",
      }, 400);
    }

    const { currentPassword, newPassword } = validation.data;

    // Find the user and their account
    const user = await db.user.findUnique({
      where: { id: decoded.sub },
      include: {
        accounts: {
          where: { providerId: "credentials" },
        },
      },
    });

    if (!user || !user.accounts[0]) {
      return c.json<AuthResponse>({
        success: false,
        error: "User not found",
      }, 404);
    }

    // Verify current password
    const account = user.accounts[0];
    if (!account.password) {
      return c.json<AuthResponse>({
        success: false,
        error: "No password set for this account",
      }, 400);
    }

    const isValidPassword = await verifyPassword(currentPassword, account.password);
    if (!isValidPassword) {
      return c.json<AuthResponse>({
        success: false,
        error: "Current password is incorrect",
      }, 400);
    }

    // Check that new password is different from current
    if (currentPassword === newPassword) {
      return c.json<AuthResponse>({
        success: false,
        error: "New password must be different from current password",
      }, 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update account password
    await db.account.update({
      where: { id: account.id },
      data: { password: hashedPassword },
    });

    return c.json<AuthResponse>({
      success: true,
    });
  } catch (error) {
    console.error("Change password error:", error);
    return c.json<AuthResponse>({
      success: false,
      error: "Failed to change password",
    }, 500);
  }
});

// Invite Team Member (Admin only)
authRoute.post("/invite", async (c) => {
  try {
    // Verify admin authorization
    const authHeader = c.req.header("Authorization") ?? null;
    const token = extractBearerToken(authHeader as string | null);

    if (!token) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return c.json({ success: false, error: "Invalid token" }, 401);
    }

    // Get the requesting user
    const session = await db.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (!session) {
      return c.json({ success: false, error: "Session not found" }, 401);
    }

    // Only admins can invite
    if (!hasAdminAccess(session.user)) {
      return c.json({ success: false, error: "Only admins can invite team members" }, 403);
    }

    const body = await c.req.json();
    const { email, name, password, role, phone } = body;

    if (!email || !name || !password || !role) {
      return c.json({ success: false, error: "Email, name, password, and role are required" }, 400);
    }

    // Validate role - full admins can invite other admins, others can only invite staff/support/user
    const validRoles = hasFullAdminAccess(session.user) 
      ? ["user", "staff", "support", "admin"]
      : ["user", "staff", "support"];
    if (!validRoles.includes(role)) {
      return c.json({ success: false, error: "Invalid role" }, 400);
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json({ success: false, error: "User with this email already exists" }, 409);
    }

    // Validate password length
    if (password.length < 6) {
      return c.json({ success: false, error: "Password must be at least 6 characters" }, 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with verified email (invited users don't need to verify)
    const userId = generateToken(16);
    const user = await db.user.create({
      data: {
        id: userId,
        name,
        email,
        emailVerified: true, // Invited users are pre-verified
        role,
        phone: phone || null,
      },
    });

    // Create account with password
    const accountId = generateToken(16);
    await db.account.create({
      data: {
        id: accountId,
        accountId: email,
        providerId: "credentials",
        userId: user.id,
        password: hashedPassword,
      },
    });

    // Send invite email with credentials
    try {
      await sendInviteEmail(email, name, role, password);
    } catch (emailError) {
      console.error("Failed to send invite email:", emailError);
      // User created but email failed - continue anyway
    }

    // Create notification for admin dashboard
    try {
      await notifyUserInvited(
        { id: user.id, name: user.name, email: user.email, role },
        session.user.name
      );
    } catch (notifyError) {
      console.error("Failed to create notification:", notifyError);
    }

    return c.json({
      success: true,
      user: toAuthUser(user),
      message: `Invitation sent to ${email}`,
    }, 201);
  } catch (error) {
    console.error("Invite error:", error);
    return c.json({ success: false, error: "Failed to invite team member" }, 500);
  }
});

export default authRoute;
