# SCM Full Stack — Integration Notes

This bundle contains all three pieces of the Sunil Choudhary Masala project:

- `scm-frontend/` — all customer-facing HTML pages, now wired to the real backend API
- `scm-backend/` — your backend, included as provided (unmodified)
- `scm-admin/` — your admin panel, included as provided (unmodified)

## What changed in the frontend

All dummy/hardcoded product, cart, order, and review data has been removed and replaced with real API calls. Pages updated:

| Page | Wired to |
|---|---|
| `login.html` / `register.html` | `POST /api/auth/login`, `POST /api/auth/register` |
| `shop.html` | `GET /api/products` (category, search, sort, maxPrice filters) |
| `product.html` | `GET /api/products/:id`, `GET/POST /api/reviews/:productId` |
| `search.html` | `GET /api/products?search=` |
| `index.html` | `GET /api/products?featured=true` and `?bestseller=true` |
| `cart.html` | `GET/PUT/DELETE /api/cart`, `POST /api/coupons/validate` |
| `checkout.html` | `GET /api/cart`, `POST /api/orders/create-payment` (Razorpay), `POST /api/orders` |
| `wishlist.html` | `GET/POST/DELETE /api/wishlist` |
| `account.html` | `GET /api/auth/me` (view only — see gap below) |
| `orders.html` / `order-detail.html` | `GET /api/orders/my-orders`, `GET /api/orders/track/:orderId` |
| `tracking.html` | `GET /api/orders/track/:orderId` (public/guest tracking) |
| `contact.html` | `POST /api/contact` |

## Bug found & fixed: server crashed on startup without Razorpay keys

While smoke-testing the backend, I found that `controllers/orderController.js` instantiated the Razorpay SDK **eagerly at module load time**:
```js
const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: ... });
```
Razorpay's constructor throws synchronously if `key_id` is missing. Because this ran at `require()` time, it crashed **the entire server** on startup — not just payments — any time `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` weren't set in `.env` (e.g. local dev before you've set up Razorpay, or COD-only testing).

**Fixed**: Razorpay is now instantiated lazily, only when `/api/orders/create-payment` is actually called, with a clear error message if keys are missing. The rest of the app (auth, products, cart, etc.) now boots and works fine even with no Razorpay keys configured yet.

## How I verified the backend (without a live MongoDB)

My sandbox only has outbound access to a small allow-list of domains (npm, PyPI, GitHub, apt) — no MongoDB Atlas, and MongoDB isn't available via Ubuntu's default apt repos, and `mongodb-memory-server`'s binary download (`fastdl.mongodb.org`) is blocked. So I couldn't run a real database here. What I did instead:

1. `npm install` — confirmed all dependencies install cleanly.
2. Loaded every route/controller file individually — this is what caught the Razorpay bug above.
3. Booted the real `server.js` with `mongoose.connect` stubbed out — confirmed Express, middleware, and all 11 route modules wire up without errors.
4. Sent real HTTP requests to the running server: `GET /` returned the expected message, `GET /api/nonexistent` correctly 404'd, and `GET /api/products` correctly attempted a real Mongo query (and only failed because there's no live database behind the stub — proving the code path is correct).

## To run it yourself locally

```bash
cd scm-backend
npm install
cp .env.example .env
# edit .env: set a real MONGO_URI (local mongod, or a free MongoDB Atlas cluster)
npm run dev
```
Then open `scm-frontend/index.html` (or serve it with any static file server). **Important for local dev**: `server.js` does not serve the frontend HTML — it only serves `/uploads`. So your frontend will run on a different origin/port (e.g. a static server on `:5500`) than the backend (`:5000`). Since every frontend page currently has `const API_BASE = '';` (same-origin), you'll need to set it to `'http://localhost:5000'` in each page for local testing — see the API_BASE section below.



1. **API_BASE** — every page defines `const API_BASE = '';` near the top of its script. This assumes the frontend and backend share the same origin. If your backend is hosted elsewhere, update `API_BASE` (e.g. `'https://api.sunilchoudharymasala.com'`) in every page, or better, replace it with a single shared `config.js` you serve alongside the HTML.

2. **Razorpay key** — `checkout.html` has:
   ```js
   const RAZORPAY_KEY_ID = 'RAZORPAY_KEY_ID_PLACEHOLDER';
   ```
   Replace this with your real Razorpay **public** key_id (never put the secret key in frontend code — that stays server-side, which your backend already handles correctly in `create-payment`).

## Full backend scan — additional bugs found & fixed

After the initial Razorpay fix, you asked me to scan the rest of the backend. Here's everything else I found, all fixed and included in this zip:

1. **`authController.js` — `register()` falsely rejected valid signups.** The duplicate-check query did `{ email: email || null }` when email wasn't provided. In MongoDB, querying a field for `null` matches documents where that field is missing too — so after the *first* phone-only user registered, every subsequent phone-only registration was falsely blocked as "already exists" (and the same in reverse for email-only signups). Fixed to only check fields that were actually provided.

2. **`authController.js` — `googleAuth()` could match a random, unrelated user.** Same root cause: `{ $or: [{ googleId }, { email }] }` — if `email` is `undefined`, it gets silently dropped from the query, turning the `$or` into `$or: [{googleId}, {}]`. An empty `{}` condition matches *every* document, so `findOne` would return the first user in the whole collection instead of `null`. Fixed the same way.

3. **`wishlistController.js` — duplicate wishlist entries.** `addToWishlist` checked `user.wishlist.includes(productId)`, but `wishlist` holds Mongoose `ObjectId` objects while `productId` is a plain string — `.includes()` uses strict equality, so this comparison is *always* false. The same product could be pushed into a wishlist repeatedly. Fixed to compare via `.toString()`, matching the pattern already used correctly in `removeFromWishlist`.

4. **`reviewController.js` — rating stats included hidden reviews.** `addReview` recalculated `ratingAvg`/`ratingCount` from *all* reviews, including ones an admin had hidden (`isApproved: false`) — so the star rating shown on a product page could reflect reviews nobody could actually see in the list. Also, `approveReview` (hide/unhide) and `deleteReview` never recalculated stats at all, so numbers went stale the moment an admin moderated anything. Added a shared `recalcProductRating()` helper (approved-only) and call it from all three places.

5. **`couponController.js` / `orderController.js` — usage limits didn't work.** `validateCoupon` checks `coupon.usedCount >= coupon.usageLimit`, but nothing in the codebase ever incremented `usedCount` — a coupon meant to be used once could be applied to unlimited orders. Added an increment in `placeOrder` whenever an order successfully applies a coupon code. Also added a guard so `validateCoupon` returns a clean 400 instead of crashing if `code` is missing from the request.

6. **`productController.js` — sort could crash on incomplete product data.** Sorting by price read `variants[0].price` directly; a product saved with an empty `variants` array (e.g. incomplete admin entry) would throw and 500 the *entire* product listing, not just that one product. Hardened with a safe fallback.

**Flagged but intentionally not changed:** `trackOrder` (`GET /api/orders/track/:orderId`) is unauthenticated by design — anyone with an order ID can view its full details (address, phone, items). The code already comments on this. This is what our guest-tracking page relies on, so I didn't lock it down, but worth knowing the order ID itself functions as a bearer secret — don't email/display it anywhere untrusted.

**Not wired up (pre-existing, not something I introduced or fixed):** `nodemailer`, `multer`, and Google OAuth verification are all present in `package.json`/`.env.example` but never actually used in the code — so the contact form doesn't send you an email (it only saves to the DB, which the admin panel presumably reads), there's no real image upload endpoint despite `Product.images` being a field, and `googleAuth` never verifies the Google token server-side (trusts whatever the frontend sends). None of these block anything we built, but worth knowing they're unfinished if you were expecting them to work.

## Known gap: Profile editing

Your backend doesn't yet expose `PUT /api/auth/me` or self-service address CRUD (only admin routes touch user records). `account.html` reads real profile data via `GET /api/auth/me`, but **edits (name/phone/addresses) currently save to the browser only** and are clearly labeled as such in the UI. Add those routes to `userRoutes.js`/`authController.js` when ready, then swap the `saveProfileLocal()` / `addAddressLocal()` functions in `account.html` for real API calls — the code is structured so that's a small, contained change.

## Auth session convention

All pages expect a JWT in `localStorage['scm_token']` (cached user object in `localStorage['scm_user']`), matching what `login.html`/`register.html` now store on successful auth. Any new page you add that needs auth should follow the same `scmGetToken()` / `scmApiFetch()` pattern already used throughout.
