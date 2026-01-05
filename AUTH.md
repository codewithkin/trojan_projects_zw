# 🔐 Authentication System Documentation

## Overview

Trojan Projects ZW uses **better-auth** for secure, modern authentication across web and mobile platforms. This document outlines the authentication architecture, user flows, and implementation details.

---

## Authentication Stack

### Backend
- **Framework**: Hono (Lightweight web server)
- **Auth Library**: better-auth (passwordless & email/password authentication)
- **Database**: PostgreSQL with Prisma ORM
- **Email Service**: Nodemailer for verification emails

### Frontend
- **Web**: Next.js 16+ with React 19
- **Mobile**: React Native with Expo Router
- **Client Library**: better-auth/react (web) + better-auth/expo (native)

---

## Authentication Flows

### 1. Sign Up (Email & Password)

#### User Flow
```
1. User enters: Name, Email, Password
2. Backend validates credentials
3. User account created
4. Verification email sent
5. User verifies email via link
6. User can sign in
```

#### Technical Flow
```
Web/Mobile Client 
  → POST /api/auth/sign-up/email
  → Backend: Hash password (scrypt)
  → Save to Database
  → Generate verification token
  → Send verification email
  → Return confirmation
```

#### Client Usage
```typescript
await authClient.signUp.email({
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePassword123",
});
```

### 2. Email Verification

#### Process
```
1. User receives verification email
2. Email contains verification link with token
3. User clicks link → redirected to app
4. App verifies token with backend
5. User's emailVerified field set to true
6. User can now sign in
```

#### Backend Handler
```typescript
emailVerification: {
  sendVerificationEmail: async ({ user, url, token }) => {
    await sendVerificationEmail({
      to: user.email,
      url, // Contains token
      token,
    });
  },
}
```

#### Email Template
- HTML formatted with verification link
- Plain text fallback
- 24-hour token expiration
- Clear call-to-action button

### 3. Sign In (Email & Password)

#### User Flow
```
1. User enters email and password
2. Backend validates credentials
3. Session created
4. User redirected to dashboard
5. Session persists across app reload
```

#### Client Usage
```typescript
await authClient.signIn.email({
  email: "john@example.com",
  password: "SecurePassword123",
  rememberMe: true,
});
```

### 4. Sign Out

#### Process
```
1. User clicks sign out
2. Session revoked on backend
3. Auth token cleared on client
4. User redirected to home/login
5. Cookies cleared
```

#### Client Usage
```typescript
await authClient.signOut({
  fetchOptions: {
    onSuccess: () => router.push("/"),
  },
});
```

---

## Data Models

### User Model
```prisma
model User {
  id            String    @id              // Unique identifier
  name          String                     // User's full name
  email         String    @unique          // Email address
  emailVerified Boolean   @default(false)  // Verification status
  image         String?                    // Profile picture URL
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
}
```

### Session Model
```prisma
model Session {
  id        String   @id
  expiresAt DateTime              // When session expires
  token     String   @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  ipAddress String?               // Client IP for security audit
  userAgent String?               // Device/browser info
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Account Model
```prisma
model Account {
  id                    String    @id
  accountId             String    // OAuth provider ID
  providerId            String    // "credential" for email/password
  userId                String
  user                  User      @relation(...)
  accessToken           String?   // OAuth access token
  refreshToken          String?   // OAuth refresh token
  password              String?   // Hashed password (scrypt)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}
```

### Verification Model
```prisma
model Verification {
  id         String   @id
  identifier String   // email or phone
  value      String   // verification token
  expiresAt  DateTime // Token expiration
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}
```

---

## Security Features

### Password Security
- **Algorithm**: scrypt (OWASP recommended)
- **Min Length**: 8 characters
- **Max Length**: 128 characters
- **Hashing**: Automatic, never stored in plain text

### Session Security
- **HttpOnly Cookies**: Cannot be accessed via JavaScript
- **Secure Flag**: Only transmitted over HTTPS
- **SameSite**: "none" (for cross-origin requests)
- **Expiration**: Configurable timeout

### Email Verification
- **Token Expiration**: 24 hours
- **Single Use**: Token invalidated after verification
- **Secure Transport**: Links only valid for 24 hours

### CORS Configuration
```typescript
cors({
  origin: env.CORS_ORIGIN,        // Only trusted origins
  allowMethods: ["GET", "POST"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,              // Allow cookies
})
```

---

## API Endpoints

### POST `/api/auth/sign-up/email`
**Sign up with email and password**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "callbackURL": "https://app.com/verify"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "emailVerified": false
  },
  "session": { "token": "..." }
}
```

### POST `/api/auth/sign-in/email`
**Sign in with email and password**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123",
  "rememberMe": true
}
```

### POST `/api/auth/sign-out`
**Sign out user and invalidate session**

### POST `/api/auth/send-verification-email`
**Manually trigger verification email**
```json
{
  "email": "john@example.com",
  "callbackURL": "https://app.com/verify"
}
```

### GET `/api/auth/session`
**Get current user session**
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "emailVerified": true
  },
  "session": { "expiresAt": "2026-01-06T..." }
}
```

---

## Environment Configuration

### Server (.env)
```env
# Better Auth
BETTER_AUTH_SECRET=<32+ character secret>
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# CORS
CORS_ORIGIN=http://localhost:3001

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@trojanprojectszw.com
SMTP_SECURE=false
```

### Web (.env.local)
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Native (.env)
```env
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
```

---

## Client Implementation

### Web (Next.js)
```typescript
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    await authClient.signUp.email(
      { email, password, name: "User" },
      {
        onSuccess: () => {
          // Redirect to verify email page
          router.push("/verify-email");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      }
    );
  };

  return (
    // Form UI
  );
}
```

### Mobile (React Native)
```typescript
import { authClient } from "@/lib/auth-client";

export function SignUpScreen() {
  const handleSignUp = async () => {
    await authClient.signUp.email(
      { email, password, name: "User" },
      {
        onSuccess: () => {
          // Navigate to verify email screen
          navigation.navigate("VerifyEmail");
        },
        onError: (error) => {
          Alert.alert("Sign Up Failed", error.error.message);
        },
      }
    );
  };

  return (
    // Form UI
  );
}
```

---

## Testing & Development

### Local Email Testing
Use **Mailtrap** or **MailHog** for local development:

**MailHog Setup:**
```bash
# Install MailHog
# macOS: brew install mailhog
# Linux: Download from github.com/mailhog/MailHog

# Run MailHog
mailhog

# Web UI: http://localhost:1025
# SMTP: localhost:1025
```

### Mock Email for Testing
```typescript
// For development, use console logging
if (env.NODE_ENV === "development") {
  console.log("Verification link:", url);
  // Also send email
}
```

---

## Future Enhancements

- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Password reset flow
- [ ] Account recovery options
- [ ] Phone number verification
- [ ] OAuth2 for third-party integrations

---

## Troubleshooting

### Email not sending?
1. Check SMTP credentials in `.env`
2. Verify firewall allows SMTP port (587/465)
3. Check email service provider settings
4. Review server logs for errors

### Session not persisting?
1. Verify cookies are enabled
2. Check CORS configuration
3. Ensure `httpOnly` and `secure` flags are correct
4. Check session expiration time

### Verification link not working?
1. Verify token hasn't expired (24 hours)
2. Check database for Verification record
3. Ensure database connection is valid
4. Review error query parameter in redirect URL

