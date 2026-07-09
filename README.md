# Répète — Deployment Guide
## Launch your app for free in 30 minutes

---

## What you need
- A GitHub account (free) → github.com
- A Supabase account (free) → supabase.com
- A Vercel account (free) → vercel.com

---

## Step 1 — Set up Supabase (10 min)

1. Go to **supabase.com** → "New project"
2. Name it `repete`, pick a region close to India (e.g. Singapore)
3. Set a database password and save it somewhere safe
4. Wait ~2 minutes for the project to spin up

### Create your database tables
5. In your Supabase project → click **SQL Editor** in the left sidebar
6. Click **"New query"**
7. Copy the entire contents of `supabase_schema.sql` (included in this project)
8. Paste it into the editor → click **Run**
9. You should see "Success. No rows returned"

### Get your API keys
10. Go to **Settings → API** in your Supabase sidebar
11. Copy two values:
    - **Project URL** → looks like `https://abcdefgh.supabase.co`
    - **anon / public key** → long string starting with `eyJ...`

---

## Step 2 — Push code to GitHub (5 min)

1. Go to **github.com** → click **"New repository"**
2. Name it `repete`, set to **Private**, click "Create repository"
3. On your computer, open Terminal in the `repete` folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/repete.git
git push -u origin main
```

---

## Step 3 — Deploy on Vercel (5 min)

1. Go to **vercel.com** → "Add New Project"
2. Click **"Import Git Repository"** → connect your GitHub → select `repete`
3. Vercel auto-detects it as a Vite project — no changes needed
4. Before clicking Deploy, click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://abcdefgh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...your anon key...` |

5. Click **Deploy**
6. Wait ~60 seconds → Vercel gives you a live URL like `repete.vercel.app`

---

## Step 4 — Get a custom domain (optional, free)

### Option A — Free Vercel subdomain
You already have `repete.vercel.app` — share this with beta users immediately.

### Option B — Buy a domain (~₹800/year)
1. Buy `repete.in` or `tryrepete.com` on GoDaddy / Namecheap (~₹800–1200/year)
2. In Vercel → your project → **Settings → Domains** → Add your domain
3. Follow the DNS instructions (takes 5–30 minutes to propagate)

---

## Step 5 — Test your live app

Open your Vercel URL and:
- [ ] Sign up with a real email
- [ ] Select a plan
- [ ] Add an outfit
- [ ] Add a contact
- [ ] Log today's outfit
- [ ] Sign out and sign back in — data should persist
- [ ] Open on your phone — should work on mobile

---

## Free tier limits (what you get for ₹0/month)

| Service | Free limit | Enough for |
|---------|-----------|------------|
| **Supabase** | 500MB DB, 50K users | First 500+ beta users |
| **Vercel** | 100GB bandwidth | Thousands of visits/month |
| **GitHub** | Unlimited private repos | Forever |

**Total monthly cost: ₹0** until you hit 50,000 users or 500MB of data.

---

## Folder structure

```
repete/
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # Root — handles auth flow + screen routing
│   ├── supabase.js       # Supabase client (reads from .env)
│   ├── constants.js      # Plans, seed data, utils
│   ├── styles.js         # All CSS
│   ├── Icons.jsx         # SVG icon components
│   ├── Auth.jsx          # SignIn + SignUp pages
│   ├── PlanSelect.jsx    # Plan selection + Upgrade modal
│   └── Dashboard.jsx     # Main app (Today, Wardrobe, Contacts, History)
├── supabase_schema.sql   # Paste this into Supabase SQL editor
├── .env.example          # Copy to .env, fill in your keys
├── vercel.json           # SPA routing config
├── vite.config.js        # Vite + React config
└── index.html            # HTML shell
```

---

## Where user data lives

| Data | Where | How |
|------|-------|-----|
| Passwords | Supabase Auth | Hashed with bcrypt — never stored as plain text |
| User profiles | `profiles` table | Auto-created on signup via database trigger |
| Wardrobe | `wardrobe` table | Per user, RLS-protected |
| Contacts | `contacts` table | Per user, RLS-protected |
| Outfit logs | `logs` table | Per user, RLS-protected |

**RLS (Row Level Security)** means every user can only ever read and write their own data — enforced at the database level, not just in the app code.

---

## Adding payments later (when you're ready)

To actually charge for Professional (₹499) and Executive (₹999) plans:

1. Create a **Razorpay** account (razorpay.com) — free to sign up
2. Create two payment links in Razorpay dashboard:
   - Professional: ₹499/month recurring
   - Executive: ₹999/month recurring
3. After successful payment, Razorpay webhook calls your backend to update `profiles.plan` in Supabase
4. Or for MVP: manually upgrade users in Supabase dashboard after payment confirmation

---

## Sharing with beta users

Once live, share this message on LinkedIn:

> "Built something for client-facing professionals — a tool that tracks what outfit you wore when you met someone, so you never repeat an outfit with the same client. If you're in sales, consulting, or law and this sounds useful, I'd love 10 minutes of your feedback. DM me for the link."

Target: sales professionals, consultants, lawyers on LinkedIn. Aim for 50 signups before pitching investors.
