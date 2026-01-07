# Trojan Projects ZW - Staff App

## Overview

The Trojan Projects Staff App is a mobile application designed specifically for staff members (admins, field technicians, and support personnel) of Trojan Projects ZW. It provides role-based access to project management, quotation handling, and AI-powered assistance.

## Features

### 🎯 Role-Based Access Control
- **Admin**: Full system access with analytics, team management, and all operational features
- **Staff**: Field technician access for project updates, photo uploads, and customer communications
- **Support**: Customer service access for quote generation, inquiries, and basic project tracking

### 📱 Core Pages

#### 1. Home Dashboard
- Role-specific stats and metrics
- Quick action buttons tailored to user role
- Real-time data refresh
- Pull-to-refresh functionality

#### 2. Projects
- View and manage projects based on role
- Status filtering (Pending, In Progress, Completed)
- Admin: See all projects with customer details
- Staff: See assigned projects
- Support: Track customer inquiries

#### 3. Quotations
- Create and manage quotations
- Status tracking (Pending, Approved, Rejected)
- Total value calculations for admins
- Approve/reject actions for admins and support staff

#### 4. AI Chat
- Role-aware AI assistant
- Technical support for field staff
- Customer service help for support team
- Analytics insights for admins

## Technology Stack

- **Framework**: React Native with Expo Router
- **UI Library**: heroui-native, lucide-react-native
- **Styling**: uniwind (TailwindCSS for React Native)
- **State Management**: React Context API
- **Navigation**: Expo Router (file-based routing)
- **Icons**: Lucide React Native

## Admin Configuration

Admin access is controlled through two mechanisms:

1. **Email Whitelist** (`config/admins.ts`)
   - admin@trojanprojects.co.zw
   - manager@trojanprojects.co.zw
   - kinzinzombe07@gmail.com
   - director@trojanprojects.co.zw

2. **Role-Based** (from database)
   - admin
   - staff
   - support

### Access Functions

```typescript
hasAdminAccess(user) // Returns true for admin/staff/support roles OR whitelisted emails
hasFullAdminAccess(user) // Returns true for admin role OR whitelisted emails
getEffectiveRole(user) // Returns the effective role considering email whitelist
```

## Key Files

- `config/admins.ts` - Admin access control configuration
- `contexts/auth-context.tsx` - Authentication context with role utilities
- `hooks/use-role.ts` - Custom hooks for role checking
- `app/(tabs)/` - Main tab screens (Home, Projects, Quotations, Chat)
- `components/sign-in.tsx` - Staff-only sign-in component
- `data/onboarding.ts` - Staff-specific onboarding content

## Custom Hooks

```typescript
useHasAdminAccess() // Check if user has admin access
useHasFullAdminAccess() // Check if user has full admin access
useEffectiveRole() // Get user's effective role
useIsAdmin() // Check if user is admin
useIsStaff() // Check if user is staff
useIsSupport() // Check if user is support
```

## Installation

```bash
cd apps/trojan-projects-zw-staff
bun install
```

## Development

```bash
bun run dev
```

## Build

```bash
# Android
bun run android

# iOS
bun run ios
```

## No Sign-Up

This app is staff-only. Sign-up functionality has been removed. Users must be granted access by administrators.

## Differences from Customer App

1. **No Sign-Up**: Staff accounts are created by admins
2. **Role-Based UI**: Different content based on user role
3. **4 Main Pages**: Simplified navigation (vs 7 tabs in customer app)
4. **Admin Tools**: Management features for admins and support
5. **Staff-Focused Onboarding**: Tailored to employee needs

## Security

- JWT-based authentication with 30-day expiry
- Role verification on all protected routes
- Admin email whitelist for enhanced security
- Staff-only access enforced at login

## Contributing

This is an internal staff application. For access or feature requests, contact the development team.

## License

Proprietary - Trojan Projects ZW
