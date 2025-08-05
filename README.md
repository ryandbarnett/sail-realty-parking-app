# Sail Realty Parking App 🚗

This is a web-based payment system for Sail Realty's private parking lot in Marina Del Rey. It allows customers to pay for hourly parking online using a QR code and handles payment processing, parking time validation, and an admin dashboard for viewing transactions.

**🔗 Live Site**: [https://sail-realty-parking-app.onrender.com](https://sail-realty-parking-app.onrender.com)

---

## 🧱 Tech Stack

* **Backend**: Node.js + Express
* **Database**: SQLite (via `sqlite3`)
* **Frontend**: HTML, vanilla JS, and CSS
* **Payments**: Stripe Checkout
* **Date/Time**: Luxon
* **Hosting**: [Render.com](https://render.com)

---

## 🔧 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/sail-realty-parking-app.git
cd sail-realty-parking-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env` file in the root directory with:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

For production, use `.env.production` instead and set `NODE_ENV=production`.

---

## 🚀 Running Locally

```bash
node server.js
```

Then visit: [http://localhost:3000](http://localhost:3000)

You can access:

* `index.html`: customer payment page
* `admin.html`: view transactions (for internal use only)

---

## ✅ Running Tests

```bash
npm test
```

Test coverage includes:

* Date/time logic (parking hour rules)
* Stripe checkout session creation
* Stripe webhook handler
* Database initialization

---

## 🌐 Deployment Notes

To deploy on Render:

1. Set environment to `production`
2. Add `.env.production` values in the Render dashboard
3. Use free-tier instance with SQLite (note: not persistent unless upgraded)
4. Make sure webhook URL is set to:

   ```
   https://your-domain.com/webhook
   ```

---

## 🌲 Environment Variables

| Variable                | Description                        |
| ----------------------- | ---------------------------------- |
| `STRIPE_SECRET_KEY`     | Your Stripe secret key             |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe |
| `NODE_ENV`              | Set to `production` on Render      |

> `.env` and `.env.production` are both `.gitignore`d.

---

## 📸 QR Code

Scan this QR code to access the parking payment page:

![Sail Parking QR](public/images/sail-parking-qr.png)

To regenerate the QR code:

```bash
node generateQR.js
```

---

## 🔒 Admin Access

There is no authentication (yet) on `admin.html`. Use discretion when sharing the link.

---

## 📜 License

This project is licensed under the MIT License.
