# Portfolio CMS

A full-stack developer portfolio with a built-in CMS admin panel. The public site showcases your work to recruiters and visitors. The `/admin` panel lets you add, edit, and delete all content without touching code.

## Features

**Public portfolio**
- Hero section with avatar, headline, and social links
- About, Skills, Education, Experience, Projects, and Contact sections
- Smooth-scroll navigation with light/dark mode toggle
- Contact form with email notifications
- Fully responsive (mobile + desktop)

**Admin CMS** (`/admin`)
- Password-protected panel — no OAuth needed
- Full CRUD for all portfolio sections
- Drag-free ordering via an `order` field
- Image URL input for all media (production-safe)
- Unread message inbox from the contact form

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router (TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui v4.9 |
| Database | PostgreSQL via [Neon](https://neon.tech) (serverless) |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Auth | NextAuth.js v4 (Credentials, JWT) |
| Email | [Resend](https://resend.com) |
| Animations | framer-motion v12 |
| Deployment | Vercel |

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
npm install
```

### 2. Set up external services

- **Neon** — create a free project at [neon.tech](https://neon.tech), copy the **pooled** connection string
- **Resend** — create a free account at [resend.com](https://resend.com), generate an API key

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
DATABASE_URL='postgresql://user:password@host/dbname?sslmode=require'

NEXTAUTH_URL='http://localhost:3000'
NEXTAUTH_SECRET='run: openssl rand -base64 32'

ADMIN_PASSWORD='choose-a-strong-password'

RESEND_API_KEY='re_your_key'
RESEND_FROM_EMAIL='onboarding@resend.dev'
CONTACT_TO_EMAIL='your@email.com'
```

> Use single quotes if your password contains `$` or other special characters.

### 4. Set up the database and run

```bash
npm run db:push    # create tables in Neon
npm run db:seed    # optional: load demo data
npm run dev        # start dev server at http://localhost:3000
```

Go to `http://localhost:3000/admin/login` and sign in with your `ADMIN_PASSWORD`.

## Available Scripts

```bash
npm run dev          # development server
npm run build        # production build
npm run db:push      # sync Prisma schema to Neon
npm run db:seed      # seed demo data
npm run db:studio    # open Prisma Studio (GUI database browser)
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `NEXTAUTH_URL` | Full URL of your site (`http://localhost:3000` in dev) |
| `NEXTAUTH_SECRET` | Random secret — `openssl rand -base64 32` |
| `ADMIN_PASSWORD` | Password to access the `/admin` panel |
| `RESEND_API_KEY` | API key from resend.com |
| `RESEND_FROM_EMAIL` | Sender address (`onboarding@resend.dev` works for testing) |
| `CONTACT_TO_EMAIL` | Where contact form submissions are delivered |

## Project Structure

```
src/
  app/
    page.tsx                    ← Public portfolio (Server Component)
    admin/
      login/page.tsx            ← Login page (outside auth layout)
      (protected)/              ← Route group — requires session
        layout.tsx              ← Auth check + admin shell
        dashboard/page.tsx
        profile/page.tsx
        projects/page.tsx + [id]/page.tsx
        experience/page.tsx + [id]/page.tsx
        education/page.tsx + [id]/page.tsx
        skills/page.tsx + [id]/page.tsx
        messages/page.tsx
    api/
      auth/[...nextauth]/route.ts
      contact/route.ts
      admin/                    ← All admin API routes
  components/
    portfolio/                  ← Public section components
    admin/                      ← Admin UI components
    ui/                         ← shadcn/ui primitives
  lib/
    prisma.ts                   ← Prisma singleton (adapter pattern)
    auth.ts                     ← NextAuth options
    utils.ts                    ← cn(), formatDate(), buttonVariants
    validations/                ← Zod schemas shared by client + server
prisma/
  schema.prisma                 ← 6 models
  seed.ts                       ← Demo data
middleware.ts                   ← Route protection for /admin
```

## Deployment

See [SETUP.md](./SETUP.md) for the full deployment walkthrough. The short version:

1. Push this repo to GitHub
2. Import it in [Vercel](https://vercel.com) — Next.js is auto-detected
3. Add all environment variables in Vercel's dashboard (use your production domain for `NEXTAUTH_URL`)
4. Deploy — `prisma generate` runs automatically via the `postinstall` script

> **Image uploads** — the `/api/upload` file upload route works in local dev only (Vercel filesystem is read-only). In production, paste image URLs directly in the admin forms (Imgur, GitHub raw, Cloudinary, etc.).

## Customisation

Everything is driven from the admin panel at `/admin`. Suggested order for filling in content:

1. **Profile** — name, headline, bio, avatar URL, social links, resume URL
2. **Experience** — jobs, most recent first (`order: 0` = top)
3. **Education** — degrees and institutions
4. **Skills** — add each skill with a category; use [Simple Icons CDN](https://cdn.simpleicons.org/) for icon URLs
5. **Projects** — tick "Featured" for the ones shown first

## License

MIT — see [LICENSE](./LICENSE) for details.
