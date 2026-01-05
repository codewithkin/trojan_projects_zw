# 🚀 Trojan Projects ZW - ULTIMATE Project Guide

## Project Vision

Build an integrated digital ecosystem for Trojan Projects ZW comprising:
1. **Mobile E-Commerce App** - iOS/Android platform for service browsing, booking, and customer management
2. **Web Platform** - Complete landing page, e-commerce, and admin dashboard for business operations

---

## 📱 Product Overview

### Product 1: Mobile E-Commerce App
**Platform**: iOS & Android (React Native + Expo)  
**Target Users**: Residential, Commercial, and Agricultural Clients

#### Features
- **Service Catalog**: Browse all Trojan Projects services with details
- **Service Booking**: Request quotes and schedule installations
- **Order Tracking**: Real-time status updates on projects
- **User Account**: Profile management, order history, preferences
- **Payment Integration**: Secure in-app payments
- **Customer Support**: Chat/contact features
- **Notifications**: Push notifications for order updates

#### Admin Features
- **Dashboard**: Key business metrics and analytics
- **Order Management**: View and manage service requests
- **Customer Management**: Client database and communication
- **Service Management**: Add/edit/delete services and pricing
- **Reports**: Revenue, bookings, and performance analytics

---

### Product 2: Web Platform
**Platform**: Next.js 16+ (React 19)  
**Target Users**: Customers, Admins, Stakeholders

#### Section 1: Landing Page
- Hero section showcasing Trojan Projects
- Service overview and value proposition
- Testimonials and case studies
- Featured projects
- Call-to-action buttons
- Contact information
- Social media links

#### Section 2: E-Commerce Platform
- Comprehensive service catalog
- Advanced filtering and search
- Detailed service pages with:
  - Service descriptions
  - Pricing information
  - Project gallery
  - Customer reviews
  - Specifications and technical details
- Shopping cart functionality
- Secure checkout process
- Order confirmation and tracking
- Invoice generation

#### Section 3: Admin Dashboard
- **Overview Panel**: KPIs and metrics
  - Total revenue
  - Active orders
  - Completed projects
  - Customer count
- **Orders Management**:
  - Pending orders
  - In-progress projects
  - Completed installations
  - Order details and status tracking
- **Customer Management**:
  - Customer database
  - Contact history
  - Purchase history
  - Communication logs
- **Service Management**:
  - Service catalog editor
  - Pricing management
  - Inventory tracking
  - Service categorization
- **Analytics & Reports**:
  - Revenue trends
  - Popular services
  - Customer acquisition metrics
  - Project completion rates
- **Settings**:
  - Business information
  - User management (admin accounts)
  - Payment configuration
  - Email templates

---

## 🏗️ Technical Architecture

### Monorepo Structure
```
trojan_projects_zw/
├── apps/
│   ├── native/          # React Native mobile app
│   ├── web/             # Next.js web platform
│   └── server/          # Hono backend API
├── packages/
│   ├── auth/            # Authentication logic
│   ├── db/              # Database & Prisma
│   ├── config/          # Shared configuration
│   └── env/             # Environment variables
├── BRANDING.md          # Brand identity
├── AUTH.md              # Authentication docs
└── ULTIMATE.md          # This file
```

### Tech Stack

#### Frontend - Web
- **Framework**: Next.js 16+
- **Runtime**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Forms**: TanStack React Form
- **Notifications**: Sonner
- **Theme**: next-themes

#### Frontend - Mobile
- **Framework**: React Native + Expo
- **Router**: Expo Router
- **UI Components**: react-native-reusables
- **Styling**: Tailwind CSS (Uniwind)
- **Storage**: Expo Secure Store (tokens)

#### Backend
- **Runtime**: Bun
- **Framework**: Hono
- **Authentication**: better-auth
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Email**: Nodemailer
- **Validation**: Zod

#### DevOps
- **Package Manager**: Bun
- **Monorepo Tool**: Turborepo
- **Version Control**: Git
- **Deployment Ready**: Vercel (web), EAS Build (mobile)

---

## 🗄️ Database Schema

### Core Models

#### Users
```prisma
User {
  id              String @id
  name            String
  email           String @unique
  emailVerified   Boolean
  image           String?
  createdAt       DateTime
  updatedAt       DateTime
  sessions        Session[]
  accounts        Account[]
  orders          Order[]
  addresses       Address[]
}
```

#### Services
```prisma
Service {
  id              String @id
  name            String
  description     String
  category        String
  basePrice       Float
  image           String?
  specs           String?
  createdAt       DateTime
  updatedAt       DateTime
  orderItems      OrderItem[]
}
```

#### Orders
```prisma
Order {
  id              String @id
  userId          String
  status          String  // pending, confirmed, in-progress, completed
  totalPrice      Float
  shippingAddress String
  createdAt       DateTime
  updatedAt       DateTime
  user            User @relation(...)
  items           OrderItem[]
  payments        Payment[]
}
```

#### Order Items
```prisma
OrderItem {
  id              String @id
  orderId         String
  serviceId       String
  quantity        Int
  price           Float
  order           Order @relation(...)
  service         Service @relation(...)
}
```

#### Payments
```prisma
Payment {
  id              String @id
  orderId         String
  amount          Float
  status          String  // pending, completed, failed
  method          String  // card, bank_transfer
  transactionId   String?
  createdAt       DateTime
  order           Order @relation(...)
}
```

---

## 🔐 Authentication Flow

### Signup → Verification → Access

```
┌─────────────────────────────────────────────────────────┐
│ 1. User Signup (Web/Mobile)                             │
│    - Email, Password, Name                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Backend Processes                                    │
│    - Validate input                                     │
│    - Hash password (scrypt)                             │
│    - Create user account                                │
│    - Generate verification token                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Send Verification Email                              │
│    - Email with verification link                       │
│    - Token expires in 24 hours                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. User Verifies Email                                  │
│    - Clicks verification link                           │
│    - Sets emailVerified = true                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. User Can Sign In                                     │
│    - Email + Password authentication                    │
│    - Session created                                    │
│    - Access to app features                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Development Roadmap

### Phase 1: Foundation (In Progress)
- [x] Project structure & monorepo setup
- [x] Authentication system with email verification
- [x] UI component libraries (shadcn/ui + react-native-reusables)
- [x] Database schema design
- [ ] API endpoint development
- [ ] Basic authentication UI (sign up/sign in pages)

### Phase 2: E-Commerce Core
- [ ] Service catalog system
- [ ] Service detail pages
- [ ] Cart functionality
- [ ] Checkout flow
- [ ] Order management system
- [ ] Payment integration

### Phase 3: Mobile App
- [ ] Mobile UI implementation
- [ ] Service browsing on mobile
- [ ] Mobile checkout flow
- [ ] Push notifications
- [ ] Offline support

### Phase 4: Web Platform
- [ ] Landing page design
- [ ] Web e-commerce implementation
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] SEO optimization

### Phase 5: Admin Features
- [ ] Admin dashboard UI
- [ ] Order management interface
- [ ] Customer management
- [ ] Service management
- [ ] Reports and analytics

### Phase 6: Enhancement
- [ ] Advanced search and filtering
- [ ] Customer reviews and ratings
- [ ] Inventory management
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Multi-language support

### Phase 7: Deployment & Launch
- [ ] Testing (unit, integration, E2E)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Web deployment (Vercel)
- [ ] Mobile deployment (App Store, Play Store)

---

## 🎨 Design System

### Color Scheme
**Primary**: Trojan Orange (`#FF6B35`)  
**Secondary**: Aqua Teal (`#00A8A8`)  
**Neutral**: Gray (`#4A4A4A`)  
**Background**: White (`#FFFFFF`)  
**Dark**: Charcoal (`#2C2C2C`)

### Component Libraries

#### Web (shadcn/ui + Tailwind)
- Button, Card, Input, Label
- Dialog, Dropdown Menu
- Tabs, Accordion
- Form validation with React Hook Form
- Toast notifications with Sonner

#### Mobile (react-native-reusables)
- Button, Text
- Card, Input
- Sheet, Dialog
- Custom styled components
- Native platform adapters

---

## 📋 API Endpoints Roadmap

### Authentication
- `POST /api/auth/sign-up/email` - User registration
- `POST /api/auth/sign-in/email` - User login
- `POST /api/auth/sign-out` - User logout
- `POST /api/auth/send-verification-email` - Resend verification
- `GET /api/auth/session` - Get current session

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin)
- `GET /api/orders` - List all orders (admin)

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/:orderId` - Get payment status

### Customers (Admin)
- `GET /api/admin/customers` - List customers
- `GET /api/admin/customers/:id` - Customer details
- `PUT /api/admin/customers/:id` - Update customer info

### Analytics (Admin)
- `GET /api/admin/analytics/overview` - Dashboard metrics
- `GET /api/admin/analytics/revenue` - Revenue trends
- `GET /api/admin/analytics/services` - Service statistics
- `GET /api/admin/analytics/customers` - Customer metrics

---

## 🔄 Development Workflow

### Getting Started
```bash
# Install dependencies
bun install

# Setup database
bun run prisma migrate dev

# Run development servers
bun run dev:web    # Next.js on port 3001
bun run dev:server # Hono on port 3000
bun run dev:native # Expo on port 8081
```

### Branching Strategy
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Commit Convention
```
feat: add new feature
fix: fix bug
docs: update documentation
refactor: refactor code
test: add tests
chore: maintenance tasks
```

---

## 📊 Success Metrics

### Mobile App
- Installation rate
- Daily active users
- Average session duration
- Booking conversion rate
- Customer retention rate

### Web Platform
- Monthly active users
- Page load time
- Conversion rate
- Customer acquisition cost
- Average order value

### Business Metrics
- Total revenue
- Average project completion time
- Customer satisfaction score
- Service utilization rate
- Growth month-over-month

---

## 🛠️ Tools & Services

### Required Accounts
- [ ] PostgreSQL database (Prisma Postgres or equivalent)
- [ ] Email service (SMTP - Gmail, Mailgun, SendGrid)
- [ ] Payment processor (Stripe, PayPal)
- [ ] File storage (AWS S3, Cloudinary)

### Development Tools
- VS Code
- Bun runtime
- Git & GitHub
- Postman or REST Client

### Monitoring & Analytics
- Application monitoring (Sentry)
- Analytics (Posthog, Mixpanel)
- Error tracking
- Performance monitoring

---

## 📝 Notes

- **Security First**: All password hashing, email verification, and session management handled securely
- **Performance**: Optimized for both web and mobile platforms
- **Scalability**: Monorepo structure allows independent scaling of services
- **User Experience**: Consistent design across platforms using shadcn/ui and react-native-reusables
- **Maintainability**: Clear separation of concerns with packages and apps structure

---

## 🎯 Next Steps

1. **Complete Phase 1**: Finish authentication UI on both platforms
2. **API Development**: Build service and order endpoints
3. **E-Commerce Core**: Implement shopping cart and checkout
4. **Mobile Implementation**: Convert web features to mobile
5. **Admin Dashboard**: Build admin interface for business operations

