 Stock Stacker — PSX Portfolio Tracker
 
 Features

**Secure login** — each user has their own private portfolio
**Full portfolio table** — symbol, quantity, buy price, current price
**Auto-calculated** — invested amount, current value, P&L per stock
**Total summary** — total invested, total current value, total P&L %
**Charts** — pie chart (allocation) + bar chart (invested vs current)
**Add / Edit / Delete** stocks
**Row Level Security** — no user can ever see another's data
**Unique theme** — warm cream + dark sidebar, gold accents, Urdu greeting

 Quick Start (Local)

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Set up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Click **New Project** — give it a name like `stock-stacker`
3. Wait for the project to be ready (~1 minute)
4. Go to **SQL Editor** (left sidebar) and paste the contents of `supabase-schema.sql` and click **Run**
5. Go to **Project Settings → API**
6. Copy your **Project URL** and **anon public key**

### Step 3 — Configure environment

```bash
# Copy the example file
cp .env.example .env
```

Open `.env` and fill in your values:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4 — Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Schema

The app uses one table: **`stocks`**

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key (auto) |
| `user_id` | UUID | Links to auth.users (auto-set) |
| `symbol` | TEXT | PSX ticker e.g. ENGRO |
| `company_name` | TEXT | Optional full name |
| `quantity` | NUMERIC | Number of shares |
| `buy_price` | NUMERIC | Price you paid per share (PKR) |
| `current_price` | NUMERIC | Today's price per share (PKR) |
| `notes` | TEXT | Optional notes |
| `created_at` | TIMESTAMPTZ | Auto timestamp |
| `updated_at` | TIMESTAMPTZ | Auto timestamp |

**Row Level Security** is enabled — users can only read/write their own rows.

---

## 🌐 Deployment (Vercel — Free)

### Option A: Vercel (Recommended, easiest)

1. Push your project to GitHub:
```bash
git init
git add .
git commit -m "Initial commit — Stock Stacker"
git remote add origin https://github.com/YOUR_USERNAME/stock-stacker.git
git push -u origin main
```

2. Go to [https://vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo

3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` → your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key

4. Click **Deploy** — done! You get a free `.vercel.app` URL

### Option B: Netlify

1. Run `npm run build` — this creates a `dist/` folder
2. Go to [https://netlify.com](https://netlify.com) → drag and drop the `dist/` folder
3. Go to **Site Settings → Environment Variables** and add the two Supabase vars
4. Redeploy

### Option C: Build locally

```bash
npm run build
# The dist/ folder contains your production app
```

---

## 🔧 Supabase Auth Settings

In your Supabase dashboard:
1. Go to **Authentication → Settings**
2. Set **Site URL** to your deployed URL (e.g. `https://stock-stacker.vercel.app`)
3. Add your URL to **Redirect URLs** as well
4. Optionally disable email confirmation for easier testing:
   - **Authentication → Settings → Email** → turn off "Confirm email"

---

## 📁 Project Structure

```
stock-stacker/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   └── StockModal.jsx     # Add/Edit stock modal
│   ├── hooks/
│   │   ├── useAuth.jsx        # Auth context + hooks
│   │   ├── useStocks.js       # Stocks CRUD + summary
│   │   └── useToast.js        # Toast notifications
│   ├── pages/
│   │   ├── AuthPage.jsx       # Login / Sign up
│   │   ├── Dashboard.jsx      # Charts + summary
│   │   ├── Portfolio.jsx      # Full stocks table
│   │   └── Settings.jsx       # Account info
│   ├── lib/
│   │   └── supabase.js        # Supabase client
│   ├── App.jsx                # Root component + routing
│   ├── main.jsx               # React entry point
│   └── index.css              # All styles
├── supabase-schema.sql        # Run this in Supabase SQL Editor
├── .env.example               # Copy to .env and fill in keys
├── index.html
├── vite.config.js
└── package.json
```

---

## 💡 How to Use

1. **Sign up** with your email and password
2. Go to **My Portfolio** → click **Add Stock**
3. Enter the PSX symbol (e.g. `ENGRO`), shares, buy price, and current price
4. The app instantly shows your P&L per stock and total
5. Update **current price** anytime to refresh your P&L
6. Enter today's **KSE-100 index value** in the banner for reference
7. Visit **Dashboard** to see your allocation pie chart and bar chart

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool (fast dev server) |
| Supabase | Database + Auth (PostgreSQL) |
| Recharts | Charts (pie, bar) |
| Lucide React | Icons |
| React Router | Page navigation |

---

*جزاک اللہ خیراً — May your investments be profitable!*
