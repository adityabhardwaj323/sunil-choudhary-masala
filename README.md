# Sunil Choudhary Masala (SCM)

Sunil Choudhary Masala (SCM) is a full-stack e-commerce platform designed to offer a seamless shopping experience for spices and culinary products. The platform consists of a modern, responsive customer storefront, a secure administrative dashboard for managing the business, and a robust backend API that powers both applications.

## Table of Contents

- [Project Overview](#project-overview)
- [Main Applications](#main-applications)
  - [Customer Frontend](#customer-frontend)
  - [Admin Frontend](#admin-frontend)
  - [Backend](#backend)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Customer Features](#customer-features)
- [Admin Features](#admin-features)
- [Backend API Modules](#backend-api-modules)
- [Data Models](#data-models)
- [Authentication and Security](#authentication-and-security)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Application Ports](#application-ports)
- [Frontend ↔ Backend Configuration](#frontend--backend-configuration)
- [Production Deployment](#production-deployment)
- [Custom Domain](#custom-domain)
- [API and Application Communication](#api-and-application-communication)
- [Payments](#payments)
- [Media Management](#media-management)
- [Location Services](#location-services)
- [Error Handling and Validation](#error-handling-and-validation)
- [Development Notes](#development-notes)
- [Deployment Checklist](#deployment-checklist)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

## Project Overview

The SCM platform is divided into three distinct, decoupled applications:

1. **Customer Frontend**: A Next.js application tailored for end-users to browse products, manage their cart, place orders, and track shipments.
2. **Admin Frontend**: A separate Next.js application restricted to administrative personnel, providing tools to manage products, orders, coupons, users, and overall site content.
3. **Backend API**: An Express.js REST API that handles all business logic, database operations, payment processing, and media management.

The two Next.js frontends utilize API routes as a BFF (Backend-For-Frontend) proxy layer. This ensures that secure HTTP-only cookies are securely attached before forwarding requests to the Express backend.

```text
Customer Frontend                 Admin Frontend
       |                                 |
       v                                 v
  Next.js BFF                       Next.js BFF
       |                                 |
       +----------------> <--------------+
                 |
                 v
            Backend API (Express)
                 |
                 v
           MongoDB Atlas
```

## Main Applications

### Customer Frontend
**Path:** `scm-frontend/`

- **Framework**: Next.js 14 (App Router) with React 18, styled using Tailwind CSS and Framer Motion.
- **Main Purpose**: The public-facing e-commerce storefront.
- **Pages/Routes Implemented**:
  - **Shop/Catalogue**: Product browsing, detailed product pages (`/product/[id]`), related products, and category filtering.
  - **Cart & Wishlist**: Persistent cart and wishlist management.
  - **Checkout**: Secure checkout flow with address selection and payment integration.
  - **Authentication**: Login, Registration, Password Reset, and OTP verification.
  - **Account**: Order history, order tracking, address book, and profile settings.
  - **Content Pages**: About Us, Blog (`/blog`, `/blog/[slug]`), Contact Us, FAQ, Privacy Policy, Terms, Shipping, Returns, Gallery, and Quality Standards.
  - **Features**: Reverse geocoding for current location detection, review submission, and responsive mobile-first design.

### Admin Frontend
**Path:** `scm-admin-frontend/`

- **Framework**: Next.js 14 (App Router) with React 18, styled using Tailwind CSS.
- **Main Purpose**: Secure dashboard for business administrators and staff.
- **Pages/Routes Implemented**:
  - **Dashboard**: High-level metrics and recent activity overview.
  - **Products**: Full CRUD management of the product catalog.
  - **Orders**: Order tracking, status updates, and detail viewing.
  - **Customers**: User management and customer order history.
  - **Coupons**: Discount code creation and management.
  - **Content Management**: Banners, Blog posts, and Gallery image management.
  - **Interactions**: Review moderation and Contact form inquiries.
  - **Analytics & Settings**: Business analytics and global store settings.

### Backend
**Path:** `scm-backend/`

- **Runtime/Framework**: Node.js with Express.js.
- **Database**: MongoDB via Mongoose.
- **Main Purpose**: The central source of truth and business logic execution.
- **Implemented Features**:
  - Secure REST API with strict CORS and rate-limiting.
  - JWT-based authentication and authorization (Customer vs. Admin roles).
  - Razorpay payment gateway integration (order creation and webhook validation).
  - Cloudinary integration for scalable media storage and image transformations.
  - Reverse geocoding via Google Maps API.
  - Email notification system (Nodemailer).

## Technology Stack

| Layer | Technology | Purpose |
| ----- | ---------- | ------- |
| **Customer Frontend** | Next.js 14 (App Router), React 18 | SSR/SSG React framework for the storefront |
| **Customer Styling** | Tailwind CSS, Framer Motion | Utility-first styling and fluid UI animations |
| **Admin Frontend** | Next.js 14 (App Router), React 18 | React framework for the admin dashboard |
| **Admin Styling** | Tailwind CSS, Lucide React | Utility-first styling and iconography |
| **Backend API** | Node.js, Express.js | High-performance RESTful API server |
| **Database** | MongoDB, Mongoose | NoSQL document database and ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs | Secure, stateless authentication and password hashing |
| **Payments** | Razorpay SDK | Payment gateway integration |
| **Media/Storage** | Cloudinary, Multer | Cloud image storage, optimization, and upload handling |
| **Email** | Nodemailer | Transactional email delivery (e.g., OTPs) |

## Repository Structure

```text
sunil-choudhary-masala/
├── scm-admin-frontend/        # Admin dashboard Next.js application
│   ├── app/                   # App Router (Admin pages, BFF API routes)
│   ├── lib/                   # Utility functions
│   └── public/                # Static assets
├── scm-backend/               # Express.js REST API
│   ├── config/                # Database and Cloudinary configuration
│   ├── controllers/           # Business logic for API endpoints
│   ├── middleware/            # Auth, validation, and error handling
│   ├── models/                # Mongoose database schemas
│   ├── routes/                # Express API route definitions
│   └── server.js              # Application entry point
├── scm-frontend/              # Customer storefront Next.js application
│   ├── app/                   # App Router (Customer pages, BFF API routes)
│   ├── components/            # Reusable UI components (Checkout, Layout, etc.)
│   ├── context/               # React Context providers (Cart, Wishlist)
│   ├── lib/                   # Utility functions
│   └── public/                # Static assets
└── README.md                  # Project documentation
```

## Customer Features

- [x] **Authentication**: Register, Login, Forgot Password, OTP verification.
- [x] **Products**: Browse catalog, view product details, select weights/variants.
- [x] **Shopping**: Add to Cart, Add to Wishlist, quantity management.
- [x] **Checkout**: Apply coupons, select saved address, initiate Razorpay payment.
- [x] **Location**: "Use My Current Location" reverse geocoding via backend.
- [x] **Orders**: View order history, track order status, detailed order summary.
- [x] **Account**: Manage profile details, manage address book.
- [x] **Content**: Read blog posts, view gallery, submit contact forms.
- [x] **Reviews**: Read and submit product reviews.

## Admin Features

- [x] **Dashboard**: View key metrics (sales, orders, users).
- [x] **Product Management**: Create, read, update, and delete products; upload images to Cloudinary.
- [x] **Order Management**: View order details, update shipping/delivery statuses.
- [x] **Customer Management**: View registered users and their order history.
- [x] **Coupon Management**: Create promotional codes with discount rules.
- [x] **Content Management**: Manage homepage banners, blog posts, and gallery images.
- [x] **Moderation**: View and manage customer product reviews and contact inquiries.
- [x] **Settings**: Configure global store settings.

## Backend API Modules

The Express backend exposes the following REST modules:
- `/api/analytics`: Admin dashboard metrics.
- `/api/auth`: User registration, login, profile, and password reset.
- `/api/banners`: Homepage banner management.
- `/api/blog`: Blog post CRUD operations.
- `/api/cart`: Shopping cart persistence.
- `/api/contact`: Customer inquiry submission and retrieval.
- `/api/coupons`: Discount code validation and management.
- `/api/gallery`: Media gallery management.
- `/api/location`: Reverse geocoding proxy to Google Maps.
- `/api/orders`: Order placement, Razorpay webhook handling, and status tracking.
- `/api/products`: Product catalog retrieval and management.
- `/api/reviews`: Product review submission and moderation.
- `/api/settings`: Global store configuration.
- `/api/users`: User management and address book operations.
- `/api/wishlist`: Customer wishlist persistence.

## Data Models

Located in `scm-backend/models/`:

- **Banner**: Homepage promotional banners.
- **Blog**: Blog posts and articles.
- **Cart**: Persistent shopping cart state per user.
- **Contact**: Customer support inquiries.
- **Coupon**: Discount codes, rules, and usage limits.
- **Gallery**: Curated image gallery entries.
- **Order**: Customer orders, payment details, addresses, and status history.
- **Product**: Product details, pricing, stock, variants, and Cloudinary image references.
- **Review**: Customer product reviews and ratings.
- **Settings**: Global configuration (e.g., shipping fees, tax rates).
- **User**: Customer and Admin accounts, hashed passwords, and saved addresses.

## Authentication and Security

The platform utilizes a secure, token-based authentication architecture:
- **Mechanism**: JSON Web Tokens (JWT) generated by the Express backend.
- **Transport**: The Next.js BFF routes securely attach the JWT to HTTP-only cookies (`customer_jwt` for the customer frontend, `admin_jwt` for the admin frontend).
- **Authorization**: Backend middleware (`protect`, `admin`) strictly enforces role-based access control. Admin routes are completely inaccessible to standard customers.
- **Security**: Passwords are cryptographically hashed using `bcryptjs`. The backend employs `helmet` for HTTP header security and `express-rate-limit` to prevent brute-force attacks.

## Environment Variables

The project requires specific environment variables to function. **Never commit actual secrets to version control.**

### Backend (`scm-backend/.env`)
| Variable | Application | Purpose |
| -------- | ----------- | ------- |
| `PORT` | Backend | Port for the Express server (default: 5000) |
| `MONGO_URI` | Backend | Connection string for MongoDB Atlas |
| `JWT_SECRET` | Backend | Cryptographic key for signing JWTs |
| `JWT_EXPIRE` | Backend | Expiration time for JWTs (e.g., 30d) |
| `RAZORPAY_KEY_ID` | Backend | Razorpay public key identifier |
| `RAZORPAY_KEY_SECRET` | Backend | Razorpay private secret for verifying webhooks |
| `CLOUDINARY_CLOUD_NAME` | Backend | Cloudinary account identifier |
| `CLOUDINARY_API_KEY` | Backend | Cloudinary API access key |
| `CLOUDINARY_API_SECRET` | Backend | Cloudinary API secret |
| `EMAIL_USER` | Backend | SMTP username (e.g., Gmail address) for Nodemailer |
| `EMAIL_PASS` | Backend | SMTP app password for Nodemailer |
| `GOOGLE_MAPS_API_KEY` | Backend | Google API key restricted for Geocoding |
| `FRONTEND_URL` | Backend | Allowed CORS origin (Customer Frontend URL) |
| `ADMIN_URL` | Backend | Allowed CORS origin (Admin Frontend URL) |

### Customer Frontend (`scm-frontend/.env.local`)
| Variable | Application | Purpose |
| -------- | ----------- | ------- |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Customer | Public Razorpay key required by the browser SDK |
| `NEXT_PUBLIC_API_URL` | Customer | The public URL of the Express backend |
| `API_BASE_URL` | Customer | The internal/server-side URL of the Express backend |

### Admin Frontend (`scm-admin-frontend/.env.local`)
| Variable | Application | Purpose |
| -------- | ----------- | ------- |
| `NEXT_PUBLIC_API_URL` | Admin | The public URL of the Express backend |
| `API_BASE_URL` | Admin | The internal/server-side URL of the Express backend |

## Local Development Setup

### 1. Backend Setup
```bash
cd scm-backend
npm install
# Create .env based on .env.example and populate with your secrets
npm run dev # Starts on port 5000 using nodemon
```

### 2. Customer Frontend Setup
```bash
cd scm-frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL and API_BASE_URL pointing to http://localhost:5000
npm run dev # Starts on port 3000
```

### 3. Admin Frontend Setup
```bash
cd scm-admin-frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL and API_BASE_URL pointing to http://localhost:5000
npm run dev # Starts on port 3001
```

## Application Ports
By default, the local development environment is configured as follows:
- **Customer Frontend**: `http://localhost:3000`
- **Admin Frontend**: `http://localhost:3001`
- **Backend API**: `http://localhost:5000`

## Frontend ↔ Backend Configuration
The frontends do not communicate with the database directly. Instead, they use Next.js API Routes (BFF) to communicate with the Express backend.
- **API Base URL**: Configured via `API_BASE_URL` (for server-side fetches) and `NEXT_PUBLIC_API_URL` (for client-side fetches).
- **CORS**: The Express backend must have the frontend domains whitelisted in its CORS configuration.
- **Authentication**: The Next.js BFF extracts the `customer_jwt` or `admin_jwt` cookie and attaches it as a `Bearer` token in the `Authorization` header when forwarding requests to Express.

## Production Deployment

The codebase is structured to support the following intended deployment architecture:

- **Customer Frontend**: Vercel, Netlify, or AWS Amplify.
- **Admin Frontend**: Vercel, Netlify, or AWS Amplify (typically protected behind a subdomain).
- **Backend**: Render, Heroku, or AWS EC2/AppRunner.
- **Database**: MongoDB Atlas.

*Note: While the code supports this architecture, the actual cloud hosting configuration (e.g., Vercel project setup, Render YAML) is managed outside of this repository.*

## Custom Domain
The Customer Frontend is designed to be attached to the company's primary custom domain (e.g., `sunilchoudharymasala.com`). The Admin Frontend should typically be deployed to a secure subdomain (e.g., `admin.sunilchoudharymasala.com`). Ensure that your backend CORS configuration (`FRONTEND_URL` and `ADMIN_URL`) accurately reflects these production domains.

## API and Application Communication

```text
       [End User]                              [Administrator]
           |                                          |
           v                                          v
+-----------------------+                  +-----------------------+
|   Customer Frontend   |                  |    Admin Frontend     |
| (Next.js App Router)  |                  | (Next.js App Router)  |
+-----------------------+                  +-----------------------+
           |                                          |
           | HTTP Requests (with JWT Cookies)         |
           v                                          v
+-----------------------+                  +-----------------------+
|  Customer BFF Routes  |                  |   Admin BFF Routes    |
|   (/app/api/*)        |                  |   (/app/api/*)        |
+-----------------------+                  +-----------------------+
           |                                          |
           | Proxied Requests (Bearer Token)          |
           v                                          v
+--------------------------------------------------------------+
|                    Express Backend API                       |
|           (Business Logic, Auth, Payment Validation)         |
+--------------------------------------------------------------+
           |                 |                 |
           v                 v                 v
   +---------------+ +---------------+ +---------------+
   | MongoDB Atlas | |   Razorpay    | |  Cloudinary   |
   |  (Database)   | |  (Payments)   | |    (Media)    |
   +---------------+ +---------------+ +---------------+
```

## Payments
Razorpay is fully integrated for secure online payments.
- **Flow**: The customer initiates checkout → Frontend requests an order ID from the Backend → Backend creates a Razorpay Order → Frontend opens the Razorpay checkout modal → Upon success, Razorpay posts a webhook to the Backend (`/api/orders/webhook`) → Backend verifies the cryptographic signature and marks the order as Paid.
- **Security**: The `RAZORPAY_KEY_SECRET` is strictly isolated in the Express backend.

## Media Management
Cloudinary is integrated for efficient image hosting and optimization.
- **Flow**: Administrators upload product or banner images via the Admin Frontend → The Express backend processes the multipart form data using `multer` → The image is securely uploaded to Cloudinary via the backend API → The resulting Cloudinary secure URL is saved to the MongoDB database.

## Location Services
The platform includes a "Use My Current Location" feature during checkout and address book management.
- **Flow**: The browser requests GPS coordinates via `navigator.geolocation` → The coordinates are sent to the Customer BFF → The BFF forwards them to the Express Backend → The Backend securely queries the Google Maps Geocoding API → The parsed, formatted address is returned to the frontend.
- **Security**: The `GOOGLE_MAPS_API_KEY` is completely hidden from the browser and resides only in the backend environment.

## Error Handling and Validation
- **Backend Validation**: Incoming API requests are validated using `express-validator` to ensure data integrity before touching the database.
- **Error Responses**: The Express backend uses centralized error handling middleware to ensure consistent JSON error responses (e.g., `{ message: "Invalid credentials" }`) without exposing sensitive stack traces in production.
- **Frontend Feedback**: The Next.js applications capture HTTP error codes from the BFF and display user-friendly toast notifications or inline error messages.

## Development Notes
- **Duplicate Utilities**: The `lib/utils.ts` file (containing Tailwind `clsx` and `twMerge` helpers) is intentionally duplicated across both frontends to maintain their independence without requiring a complex Monorepo workspace configuration.
- **Build Processes**: Ensure you run `npm run build` in both frontends before deployment to catch any Next.js strict type-checking errors.

## Deployment Checklist

### Backend
- [ ] `MONGO_URI` configured in environment.
- [ ] `JWT_SECRET` generated securely and configured.
- [ ] Razorpay, Cloudinary, and Email credentials configured.
- [ ] `FRONTEND_URL` and `ADMIN_URL` updated to production domains for CORS.
- [ ] Startup command `npm start` executes successfully.

### Customer Frontend
- [ ] `API_BASE_URL` and `NEXT_PUBLIC_API_URL` point to the production backend.
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` configured.
- [ ] Build succeeds (`npm run build`).
- [ ] Custom domain connected.

### Admin Frontend
- [ ] `API_BASE_URL` and `NEXT_PUBLIC_API_URL` point to the production backend.
- [ ] Build succeeds (`npm run build`).
- [ ] Custom domain connected.

### Database
- [ ] MongoDB Atlas cluster provisioned.
- [ ] Network Access (IP Whitelist) allows connections from the Backend hosting provider.
- [ ] Database user credentials secured.

## Troubleshooting

- **Backend Cannot Connect to MongoDB**: Ensure your IP address is whitelisted in MongoDB Atlas Network Access settings. Verify the `MONGO_URI` format.
- **Frontend Cannot Reach Backend**: Verify `NEXT_PUBLIC_API_URL` is set correctly in `.env.local` and that the backend is running.
- **CORS Errors**: Ensure the frontend's domain (including the exact port in development) is added to the backend's `cors()` middleware configuration.
- **Admin Login Fails**: Ensure you are using credentials for a user document that has the `isAdmin: true` flag set in MongoDB.
- **Next.js Build Errors**: Run `npx tsc --noEmit` locally to identify TypeScript strictness errors that cause Vercel/Netlify builds to fail.

## Future Improvements
*These features are not currently implemented but represent potential enhancements:*
- SMS notifications for order tracking.
- Advanced real-time analytics dashboard with charting libraries.
- Multi-currency and international shipping support.
- Automated inventory low-stock alerts.

## License
*This project currently has no explicit open-source license. All rights are reserved to Sunil Choudhary Masala.*
