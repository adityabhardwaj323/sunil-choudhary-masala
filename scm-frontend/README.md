# SCM Full Stack — Production Deployment Notes

This bundle contains all three pieces of the Sunil Choudhary Masala project, configured to talk to your deployed Render backend at `https://scm-backend-ork4.onrender.com`.

## ⚠️ Product images now use Cloudinary — you MUST set 3 env vars on Render

Previously, admin-uploaded product images were saved to local disk on the backend. That's broken on Render: its filesystem is **ephemeral** and wipes any locally-written files on every redeploy (or restart), so uploaded images would silently disappear. This has been replaced with **Cloudinary** (free tier, persistent, CDN-backed) — this is the actual fix for the "admin uploads a photo but it never shows on the customer site" issue.

### Setup steps (do this before testing image uploads)

1. **Create a free Cloudinary account** at [cloudinary.com](https://cloudinary.com) if you don't have one.
2. From your Cloudinary **Dashboard** (cloudinary.com/console), copy three values: **Cloud Name**, **API Key**, **API Secret**.
3. **On Render**, go to your backend service → **Environment** tab → add these three variables:
   ```
   CLOUDINARY_CLOUD_NAME=<your cloud name>
   CLOUDINARY_API_KEY=<your api key>
   CLOUDINARY_API_SECRET=<your api secret>
   ```
4. Redeploy the backend (Render usually does this automatically when env vars change — if not, trigger a manual deploy).
5. **For local development**, add the same three lines to your local `.env` file (see the updated `.env.example`).
6. Test: in the admin panel, edit or add a product, upload an image, save. It should now appear correctly on `shop.html`/`product.html`/etc., and — unlike before — it will **still be there after your next deploy**, since Cloudinary is fully persistent.

If those env vars are missing, image uploads will fail with a clear `"Image upload failed"` error from the backend rather than silently doing nothing — so you'll know immediately if the Cloudinary setup isn't complete.

### What changed in the code (for reference)

- **`scm-backend/config/cloudinary.js`** *(new file)* — Cloudinary SDK configuration, reads the three env vars above.
- **`scm-backend/middleware/upload.js`** — switched from `multer.diskStorage` (writes to local disk) to `multer.memoryStorage` (keeps the file in memory only, just long enough to hand off to Cloudinary).
- **`scm-backend/controllers/productController.js`** — `uploadProductImages` now uploads each file's buffer to Cloudinary (via a base64 data URI, which Cloudinary's SDK accepts directly) and returns Cloudinary's permanent `secure_url` for each image, instead of a local `/uploads/products/...` path.
- **`scm-backend/server.js`** — removed the now-unused `app.use('/uploads', express.static('uploads'))` line, since nothing writes to local disk anymore.
- **`scm-backend/package.json`** — added `cloudinary` as a dependency.
- **`scm-backend/.env.example`** — added the three `CLOUDINARY_*` variables.
- **`scm-admin/products.html`** — fixed `renderImgPreviews()`, which previously *always* prepended the backend's own URL to every image path (correct for local paths, but this now double-concatenates with Cloudinary's already-absolute URLs, producing a broken image link). It now checks whether the URL is already absolute first, matching the same pattern already used on the customer-facing pages.
- **Customer-facing pages** (`shop.html`, `product.html`, `index.html`, `wishlist.html`, `search.html`, `cart.html`, `checkout.html`) — **no functional changes needed**. Their shared `scmImgUrl()` helper was already written to pass absolute URLs through unchanged, so Cloudinary's URLs just work. Only updated a stale code comment in each file to reflect the new storage backend.

### One pre-existing, unrelated minor gap (not fixed, just flagging)

`orders.html`'s order list checks `it.image` to decide whether to show a 🌶️ emoji, but never actually renders an `<img>` tag even when an image URL is present — so order history currently shows emoji only, never real product photos. This was there before this change and isn't something you asked me to fix yet; happy to do it if useful.

## Production backend URL (from previous session, still true)

All 14 commerce-facing frontend pages and the admin panel point at `https://scm-backend-ork4.onrender.com`. Verified via full-project grep: zero `localhost`/`127.0.0.1` references remain anywhere.

CORS uses `app.use(cors())` (wildcard) — correct for this app's JWT Bearer-token auth (no cookies involved), no changes needed.

## Founder photo (from previous session, still true)

Real photo of Sunil Choudhary added to `about.html` and `heritage.html`, embedded as inline base64 (same approach as the site logo).

## Other things worth checking before fully going live

1. **Render cold starts**: free tier spins down after inactivity; first request after idle can take 20–50 seconds. Expected Render behavior, not a bug.
2. **Razorpay key**: `checkout.html` still has `RAZORPAY_KEY_ID_PLACEHOLDER` — replace with your real public key_id before accepting online payments.
3. **Seed data**: if your production database is empty, run `node seed.js` against it once (with production `MONGO_URI` set) for an admin login + sample products.

## Carried over from earlier sessions (still true)

- Full backend bug sweep (register/login duplicate-check bugs, wishlist duplicate-entry bug, review rating recalculation, coupon usage-limit enforcement, Razorpay eager-init crash) — all fixed.
- Customer detail view in `scm-admin/customers.html`.
- Map location picker (Leaflet + OpenStreetMap, no API key) on `checkout.html` and `account.html`.
- **Known gap**: `PUT /api/auth/me` and self-service address CRUD still don't exist on the backend, so profile editing in `account.html` saves locally only (clearly labeled in the UI).
- Live cart-count badge syncs across every page after add/remove actions; the `shop.html` duplicate-function bug that silently broke "Add to Cart" is fixed.

## Auth session convention

Customer pages: JWT in `localStorage['scm_token']`, cached user in `localStorage['scm_user']`. Admin panel: separate `localStorage['scm_admin_token']` / `['scm_admin_user']`. Any new page needing auth should follow the same `scmGetToken()` / `scmApiFetch()` pattern already used throughout.
