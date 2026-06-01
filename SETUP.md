# Portfolio — Setup, Testing & Deployment Guide

## Table of Contents

1. [Before You Start](#1-before-you-start)
2. [Local Development Setup](#2-local-development-setup)
3. [Running and Testing Locally](#3-running-and-testing-locally)
4. [What to Test Manually](#4-what-to-test-manually)
5. [Deploying to Production](#5-deploying-to-production)
6. [Post-Deploy Checklist](#6-post-deploy-checklist)
7. [Adding Your Real Content](#7-adding-your-real-content)
8. [Ongoing Maintenance](#8-ongoing-maintenance)

---

## 1. Before You Start

You need accounts on two services before anything works:

### Neon (database)
1. Go to [neon.tech](https://neon.tech) → sign up free
2. Create a new project (any name, pick the region closest to you)
3. On the dashboard, click **Connection Details**
4. Copy the **Pooled connection** string — it looks like:
   ```
   postgresql://user:password@ep-xxx-yyy.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   > Use the **pooled** URL (has `-pooler` in the hostname), not the direct one. This is critical for serverless environments.

### Resend (contact form email) — optional but recommended
1. Go to [resend.com](https://resend.com) → sign up free
2. Go to **API Keys** → create a key
3. For the `RESEND_FROM_EMAIL`, you can use `onboarding@resend.dev` for testing, or add your own domain later

---

## 2. Local Development Setup

### Step 1: Fill in your `.env` file

Open `.env` in the project root and replace every placeholder:

```bash
# Paste your Neon pooled connection string here
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Generate a secret — run this in your terminal:
# openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-the-output-here"

# Choose a strong password for the admin panel
ADMIN_PASSWORD="your-strong-password-here"

# From Resend dashboard (or leave as placeholder if skipping email for now)
RESEND_API_KEY="re_your_key_here"
RESEND_FROM_EMAIL="onboarding@resend.dev"
CONTACT_TO_EMAIL="youremail@hotmail.com"
```

### Step 2: Push the database schema

This creates all 6 tables in Neon. Run it once when setting up, and again any time you change `prisma/schema.prisma`:

```bash
npm run db:push
```

You should see output like:
```
✔ Your database is now in sync with your Prisma schema.
```

### Step 3: (Optional) Seed demo data

This inserts sample projects, experience, skills, and education so you can see the portfolio immediately instead of a blank page:

```bash
npm run db:seed
```

### Step 4: Start the dev server

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## 3. Running and Testing Locally

### What you'll see at first visit

- `http://localhost:3000` — if you ran the seed, you'll see the full portfolio. If not, you'll see a "not set up yet" message with a link to the admin.
- `http://localhost:3000/admin/login` — admin panel login

### Admin panel login

Enter the `ADMIN_PASSWORD` you set in `.env`. You'll be redirected to the dashboard.

### Check the Prisma Studio (optional visual DB browser)

```bash
npm run db:studio
```

Opens a GUI at `http://localhost:5555` where you can see all your database rows directly. Useful for debugging.

---

## 4. What to Test Manually

Work through this checklist before deploying:

W -> working

### Public portfolio

- [W] Home page loads without errors (check browser console for red errors)
- [W] All sections render: Hero, About, Projects, Experience, Education, Skills, Contact
- [W] Navbar smooth-scrolls to sections when clicking links
- [W] Mobile layout works — open DevTools → toggle device toolbar → check at 375px width
- [W] Hero animations play on first load (fade-up stagger)
- [W] Project cards animate in when you scroll to them
- [W] If you added a resume URL — Resume button appears in navbar and opens the PDF

### Contact form

- [W] Fill in name, email, message and submit
- [W] Toast notification appears: "Message sent!"
- [W] Go to `/admin/messages` — the message appears there
- [W] If Resend is configured — check your email inbox

### Admin panel — auth

- [W] Visiting `/admin` without logging in redirects to `/admin/login`
- [W] Wrong password shows an error message
- [W] Correct password logs you in and redirects to dashboard
- [W] Sign Out button returns you to the login page

### Admin panel — CRUD

For each section (Profile, Projects, Experience, Education, Skills):

- [W] **Create**: Click "New", fill in the form, save — item appears in the list
- [W] **Edit**: Click the pencil icon, change a value, save — change reflects on the list
- [W] **Delete**: Click the trash icon, confirm — item is removed
- [W] **Public site updates**: After creating/editing, visit `http://localhost:3000` — changes appear immediately (may need a hard refresh)

### Image upload (dev only) -> Works

- [ ] In Projects form, switch to "Upload file" mode
- [ ] Upload an image under 5MB
- [ ] Preview appears below the upload area
- [ ] After saving, image shows on the public portfolio

> **Note**: Image file upload only works in local development. In production (Vercel), the filesystem is read-only. Use the **URL mode** instead (paste an image URL from Imgur, GitHub, or a CDN). This is the recommended approach for production.

---

## 5. Deploying to Production

### Step 1: Push code to GitHub

If you haven't initialised a git repo yet:

```bash
git init
git add .
git commit -m "Initial portfolio commit"
```

Create a new repository on GitHub (go to github.com → New repository), then:

```bash
git remote add origin https://github.com/your-username/portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub
2. Click **Add New Project** → import your `portfolio` repository
3. Vercel auto-detects Next.js — no framework config needed
4. **Before clicking Deploy**, go to **Environment Variables** and add all vars from your `.env`:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon pooled connection string |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` (use your actual Vercel URL) |
| `NEXTAUTH_SECRET` | The same secret you generated locally |
| `ADMIN_PASSWORD` | Your admin password |
| `RESEND_API_KEY` | Your Resend key |
| `RESEND_FROM_EMAIL` | Your from email |
| `CONTACT_TO_EMAIL` | `ganapathiramanaz1@gmail.com` |

5. Click **Deploy**

The first deploy runs `npm run build` → `prisma generate` (via postinstall) → starts the app.

> **Important**: `NEXTAUTH_URL` must be your real production URL. If you add a custom domain later, update this variable in Vercel's settings.

### Step 3: Run db:push against production (if first deploy)

After the deploy succeeds, you still need the database tables to exist. The easiest way:

```bash
# Your local DATABASE_URL already points to Neon (same database)
# So running this locally pushes to the same Neon DB that Vercel uses:
npm run db:push
```

If you ran this during local setup, the tables already exist — nothing to do.

---

## 6. Post-Deploy Checklist

After your first successful Vercel deploy:

- [ ] Visit your Vercel URL — public portfolio loads
- [ ] Visit `/admin/login` — can log in with your password
- [ ] Submit the contact form on the live site — message appears in `/admin/messages`
- [ ] Check Vercel **Functions** tab for any server errors (Vercel dashboard → your project → Functions)

### Custom domain (optional)

In Vercel dashboard → your project → **Domains** → Add domain. Then:
- Update `NEXTAUTH_URL` environment variable to your custom domain
- Redeploy (push an empty commit or trigger via Vercel dashboard)

---

## 7. Adding Your Real Content

Log in at `/admin/login` and fill in everything. Suggested order:

1. **Profile** — your name, headline, bio, avatar URL, social links, resume URL
2. **Experience** — past and current jobs (most recent first, use the `order` field: 0 = top)
3. **Education** — degrees and institutions
4. **Skills** — add each skill with a category. Use [Simple Icons CDN](https://cdn.simpleicons.org/) for icon URLs:
   - Example: `https://cdn.simpleicons.org/typescript` for TypeScript
   - Browse icons at [simpleicons.org](https://simpleicons.org)
5. **Projects** — your real projects. Check "Featured" for the ones you want shown first

### Tips

- **Images**: Paste a direct image URL (from GitHub, LinkedIn, or upload to Imgur) — no need to upload files in production
- **Resume**: Upload your PDF to Google Drive, set sharing to "Anyone with link can view", and paste the direct download link
- **Order field**: Lower number = appears first on the portfolio. `0` is the top item
- **Bio formatting**: Use two newlines between paragraphs — they'll render as separate paragraphs on the About section

---

## 8. Ongoing Maintenance

### Updating content
Just log into `/admin` and edit. No code changes needed.

### Updating code
```bash
# Make your changes locally
git add .
git commit -m "your message"
git push
# Vercel auto-deploys on push to main
```

### If you change the Prisma schema
After adding a new field or model to `prisma/schema.prisma`:
```bash
npm run db:push   # applies the schema change to Neon
```

### Keeping dependencies updated
```bash
npm outdated      # see what's stale
npm update        # update minor/patch versions
```

---

## Tech Stack Quick Reference

| Layer | What | Version |
|-------|------|---------|
| Framework | Next.js App Router | 16 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS + shadcn/ui | 4 / latest |
| Database | PostgreSQL via Neon | serverless |
| ORM | Prisma | 7 |
| DB Adapter | `@prisma/adapter-pg` + `pg` | latest |
| Auth | NextAuth.js Credentials | v4 |
| Email | Resend | latest |
| Animations | framer-motion | 12 |
| Icons | lucide-react + react-icons | latest |
| Deployment | Vercel | — |

### Key file locations

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Public portfolio entry point |
| `src/app/admin/` | All admin panel pages |
| `src/app/api/admin/` | Admin REST API routes |
| `src/app/api/contact/route.ts` | Contact form handler |
| `src/components/portfolio/` | Public section components |
| `src/components/admin/` | Admin-only components |
| `src/lib/prisma.ts` | Database client (Prisma singleton) |
| `src/lib/auth.ts` | NextAuth config |
| `src/lib/validations/` | Zod schemas (shared client + server) |
| `prisma/schema.prisma` | Database schema |
| `prisma/seed.ts` | Demo data seed script |
| `middleware.ts` | Route protection for `/admin` |
| `.env` | Local environment variables (gitignored) |
