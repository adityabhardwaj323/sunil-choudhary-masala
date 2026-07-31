# Sunil Choudhary Masala — Backend

This is the backend API for the Sunil Choudhary Masala e-commerce website.

## 🛠️ What You Need Installed First
1. **Node.js** — download from nodejs.org
2. **MongoDB** — download from mongodb.com/try/download/community

## 🚀 How to Run This Backend

### Step 1: Open this folder in VS Code
Open a terminal inside this `scm-backend` folder.

### Step 2: Install all required packages
```
npm install
```
This reads `package.json` and downloads everything needed (Express, Mongoose, etc.)

### Step 3: Create your `.env` file
Copy `.env.example` and rename the copy to `.env`
Then open `.env` and you can leave most values as-is for local testing.

### Step 4: Start MongoDB
Make sure MongoDB is running on your computer. Usually it starts automatically after install,
or run `mongod` in a separate terminal.

### Step 5: Seed sample data (one-time only)
```
node seed.js
```
This creates an admin login and a few sample products so you have data to test with.

**Admin Login Created:**
- Email: `admin@sunilchoudharymasala.com`
- Password: `admin123`
(Change this password after first login in production!)

### Step 6: Start the server
```
npm run dev
```
You should see:
```
✅ MongoDB Connected: 127.0.0.1
🚀 Server running on http://localhost:5000
```

### Step 7: Test it's working
Open your browser and visit:
```
http://localhost:5000
```
You should see: `{"message": "🌶️ Sunil Choudhary Masala Backend API is running!"}`

---

## 📂 Folder Structure Explained

```
scm-backend/
├── config/db.js          → Connects to MongoDB
├── models/                → Database structure (User, Product, Order, etc.)
├── controllers/           → The actual logic for each feature
├── routes/                → URL endpoints (e.g. /api/products)
├── middleware/auth.js     → Login security checks
├── server.js              → Main file that starts everything
├── seed.js                → Creates sample admin + products
└── .env                   → Your secret keys (never share this file!)
```

## 🔑 Main API Endpoints

| Method | Endpoint | What it does |
|--------|----------|---------------|
| POST | /api/auth/register | Create new customer account |
| POST | /api/auth/login | Login |
| GET | /api/products | View all products |
| POST | /api/products | Add product (admin only) |
| GET | /api/cart | View your cart |
| POST | /api/cart | Add item to cart |
| POST | /api/orders | Place an order |
| GET | /api/orders/track/:orderId | Track an order |
| POST | /api/coupons/validate | Apply a coupon code |
| GET | /api/wishlist | View wishlist |

## 🔗 Next Step: Connect Frontend

Once this backend is running, the next step is updating your HTML/JS frontend files
to call these API endpoints instead of using fake/hardcoded data. We'll do this together
in the next step.

## ⚠️ Razorpay & Email Setup

To enable real payments and emails, you need to:
1. Create a free Razorpay account at razorpay.com → get API keys → put in `.env`
2. Create a Gmail App Password → put in `.env` for email notifications

These are optional for now — the site will work without them, just payment/email features
won't be active until you add real keys.
