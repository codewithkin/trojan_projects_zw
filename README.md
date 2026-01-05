# Trojan Projects Zimbabwe

A modern full-stack service management platform for Trojan Projects, offering solar installation, CCTV, electrical, water, and welding services in Zimbabwe. Built with TypeScript, Next.js, React Native, and Hono.

## 🌟 Features

- **Multi-Platform**: Web and mobile applications with 1:1 component parity
- **Service Catalog**: Browse and request professional installation services
- **Project Tracking**: Real-time status updates for all service requests (pending, confirmed, in-progress, completed, cancelled)
- **User Dashboard**: Comprehensive profile management with project statistics
- **E-commerce UX**: Modern, user-friendly interface with category filtering and search
- **Authentication**: Secure user authentication with Better-Auth
- **Type-Safe**: Full TypeScript support across the entire stack

## 📱 Platforms

### Web Application (Next.js)
- **Home Page**: Service catalog with category filters and search
- **Projects Page**: Project management with status-based tabs
- **Profile Page**: User account management and statistics

### Mobile Application (React Native + Expo)
- **Home Tab**: Services grid with category filtering (matches web)
- **Projects Tab**: Project tracking with status tabs (matches web)
- **Profile Tab**: User profile and settings (matches web)

## 🏗️ Architecture

### Shared Component Design
The application follows a **1:1 component parity** philosophy between web and native platforms:

- **ServiceCard**: Displays service offerings with pricing, ratings, and features
- **ProjectCard**: Shows user's service requests with status, technician info, and progress
- Both platforms share identical data structures and business logic

### Service Categories
- **Solar**: Solar panel installations (1.5 KVA - 10 KVA systems)
- **CCTV**: Security camera installations
- **Electrical**: Electrical wiring and installations
- **Water**: Borehole drilling and water systems
- **Welding**: Custom welding services

### Project Statuses
- **Pending**: Request submitted, awaiting confirmation
- **Confirmed**: Service confirmed, awaiting technician assignment
- **In Progress**: Technician assigned, work in progress
- **Completed**: Service successfully completed
- **Cancelled**: Request cancelled by user or company

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework for web application
- **React Native + Expo**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first styling (web)
- **shadcn/ui**: Reusable component library (web)
- **Framer Motion**: Smooth animations and transitions

### Backend
- **Hono**: Lightweight, performant API server
- **Prisma**: TypeScript-first ORM
- **PostgreSQL**: Relational database
- **Better-Auth**: Authentication and authorization

### Development
- **Turborepo**: Monorepo build system
- **Bun**: Fast JavaScript runtime
- **TypeScript**: Strict type checking

## 🚀 Getting Started

### Prerequisites
- Bun installed ([bun.sh](https://bun.sh))
- PostgreSQL database
- Node.js 18+ (for compatibility)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trojan_projects_zw
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
# Copy example env files
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
cp apps/native/.env.example apps/native/.env
```

4. Configure your database connection in `apps/server/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/trojan_projects"
```

5. Apply database schema:
```bash
bun run db:push
```

### Development

Start all applications:
```bash
bun run dev
```

Or start individual applications:
```bash
# Web application (Next.js)
bun run dev:web        # http://localhost:3001

# Mobile application (Expo)
bun run dev:native     # Expo DevTools

# Backend API (Hono)
bun run dev:server     # http://localhost:3000
```

### Building for Production

Build all applications:
```bash
bun run build
```

Build individual applications:
```bash
bun run build:web
bun run build:server
```

## 📁 Project Structure

```
trojan_projects_zw/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── src/
│   │   │   ├── app/           # Next.js app router pages
│   │   │   │   ├── page.tsx           # Home (services catalog)
│   │   │   │   ├── (app)/
│   │   │   │   │   ├── projects/page.tsx    # Projects page
│   │   │   │   │   └── profile/page.tsx     # Profile page
│   │   │   ├── components/    # React components
│   │   │   │   ├── service-card.tsx         # Service display card
│   │   │   │   ├── project-card.tsx         # Project status card
│   │   │   │   ├── site-header.tsx          # Navigation header
│   │   │   │   └── site-footer.tsx          # Site footer
│   │   │   ├── data/          # Mock data and types
│   │   │   │   └── services.ts              # Service/Project types & data
│   │   │   └── lib/           # Utilities
│   │
│   ├── native/                 # React Native mobile app
│   │   ├── app/
│   │   │   ├── (drawer)/(tabs)/
│   │   │   │   ├── index.tsx          # Home (services)
│   │   │   │   ├── projects.tsx       # Projects tab
│   │   │   │   └── profile.tsx        # Profile tab
│   │   ├── components/
│   │   │   ├── service-card.tsx       # Native ServiceCard (1:1 with web)
│   │   │   └── project-card.tsx       # Native ProjectCard (1:1 with web)
│   │   └── data/
│   │       └── services.ts            # Shared data structure (mirrors web)
│   │
│   └── server/                 # Hono API server
│       └── src/
│           └── index.ts
│
├── packages/
│   ├── auth/                   # Better-Auth configuration
│   ├── db/                     # Prisma schema & database
│   │   └── prisma/
│   │       └── schema/
│   ├── config/                 # Shared TypeScript configs
│   └── env/                    # Environment validation
│
└── README.md
```

## 📋 Available Scripts

### Development
- `bun run dev` - Start all applications in development mode
- `bun run dev:web` - Start only the web application
- `bun run dev:native` - Start only the mobile app (Expo)
- `bun run dev:server` - Start only the API server

### Building
- `bun run build` - Build all applications for production
- `bun run build:web` - Build web application
- `bun run build:server` - Build API server

### Database
- `bun run db:push` - Push Prisma schema changes to database
- `bun run db:studio` - Open Prisma Studio (database GUI)
- `bun run db:generate` - Generate Prisma client

### Code Quality
- `bun run check-types` - Type check all applications
- `bun run lint` - Lint all code
- `bun run format` - Format code with Prettier

## 🎨 Design System

### Brand Colors
- **Trojan Navy**: `#0F1B4D` - Primary brand color
- **Trojan Gold**: `#FFC107` - Accent color for CTAs and highlights

### Component Philosophy
Both web and native applications use identical component structures:
- Same props interfaces
- Matching visual hierarchy
- Consistent spacing and sizing
- Identical user interactions

This ensures a seamless user experience across platforms while maintaining platform-specific optimizations.

## 📄 License

This project is proprietary software for Trojan Projects Zimbabwe.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the development team.

---

Built with ❤️ for Trojan Projects Zimbabwe
