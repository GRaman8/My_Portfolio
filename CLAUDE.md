@AGENTS.md

# Portfolio Project — Context for Claude

## What this project is

A full-stack developer portfolio website with a built-in CMS admin panel. The public site shows Sabari's work. The `/admin` panel lets him add/edit/delete all content without touching code.

## Tech stack

- **Next.js 16** App Router, TypeScript — frontend + API in one repo
- **Tailwind CSS v4 + shadcn/ui v4.9** — shadcn uses `@base-ui/react`, NOT `@radix-ui`. Buttons do NOT support `asChild`. Use `Link` with `cn(buttonVariants(...))` instead.
- **Prisma 7** — uses adapter pattern, NOT the old `DATABASE_URL` in schema. See `src/lib/prisma.ts`.
- **`@prisma/adapter-pg` + `pg`** — the database adapter. Import `PrismaClient` from `@/generated/prisma/client` (not `@prisma/client`).
- **Neon (serverless Postgres)** — database host
- **NextAuth v4** — Credentials provider only, single `ADMIN_PASSWORD` env var, JWT session
- **Resend** — transactional email for contact form
- **framer-motion v12** — animations
- **react-icons** (fa6) — social brand icons (lucide-react v1 removed Github/Linkedin/Twitter)

## Critical gotchas

### Prisma 7 (very different from Prisma 5/6)
- Generated client is at `src/generated/prisma/client` — import from there, NOT `@prisma/client`
- Requires a database adapter. Current setup uses `PrismaPg` from `@prisma/adapter-pg`
- `prisma.config.ts` at root manages config (not just `schema.prisma`)
- Run `npm run db:push` to sync schema, `npm run db:seed` to seed data

### shadcn/ui v4.9 with @base-ui
- `Button` does NOT have `asChild` prop (base-ui buttons render differently)
- For link-styled buttons: `<Link href="..." className={cn(buttonVariants({ variant: "..." }))}>`
- `buttonVariants` is re-exported from `src/lib/utils.ts`

### react-hook-form + zod v4 resolver
- `@hookform/resolvers` v5 changed resolver types — use `as unknown as Resolver<FormData>` cast when types mismatch
- Do NOT use `.default()` in zod schemas for form fields — provide defaults in `useForm({ defaultValues: ... })` instead
- Use `Controller` for custom inputs (Select, Switch, TechStackInput, BulletListEditor, ImageUpload)

### Image upload
- `/api/upload` writes to `public/images/` — works in dev only
- Vercel filesystem is read-only at runtime — use URL mode in production
- Future improvement: migrate to `@vercel/blob`

### Next.js dynamic pages
- `src/app/page.tsx` and `src/app/admin/dashboard/page.tsx` have `export const dynamic = "force-dynamic"` — this is intentional, they fetch from DB

## Project structure

```
src/
  app/
    page.tsx                    ← Public portfolio (Server Component)
    layout.tsx                  ← Root layout, Geist font, dark class
    admin/
      layout.tsx                ← Auth check + admin shell
      login/page.tsx
      dashboard/page.tsx
      profile/page.tsx
      projects/page.tsx + [id]/page.tsx
      experience/page.tsx + [id]/page.tsx
      education/page.tsx + [id]/page.tsx
      skills/page.tsx + [id]/page.tsx
      messages/page.tsx
    api/
      auth/[...nextauth]/route.ts
      contact/route.ts          ← Public, rate-limited
      upload/route.ts           ← Admin only, dev only
      admin/profile/route.ts
      admin/projects/route.ts + [id]/route.ts + reorder/route.ts
      admin/experience/route.ts + [id]/route.ts
      admin/education/route.ts + [id]/route.ts
      admin/skills/route.ts + [id]/route.ts
      admin/messages/route.ts + [id]/route.ts
  components/
    portfolio/                  ← Navbar, Hero, About, Projects, ProjectCard,
                                   Experience, Education, Skills, Contact,
                                   ContactForm, Footer
    admin/                      ← AdminSidebar, AdminHeader, SessionWrapper,
                                   ConfirmDialog, BulletListEditor,
                                   TechStackInput, ImageUpload
    ui/                         ← shadcn/ui components
  lib/
    prisma.ts                   ← Prisma singleton with pg adapter
    auth.ts                     ← NextAuth options
    resend.ts                   ← Resend client
    utils.ts                    ← cn(), formatDateRange(), formatDate(), buttonVariants re-export
    validations/                ← Zod schemas (profile, project, experience,
                                   education, skill, contact)
prisma/
  schema.prisma                 ← 6 models: Profile, Project, Experience,
                                   Education, Skill, ContactMessage
  seed.ts                       ← Demo data
middleware.ts                   ← NextAuth route guard for /admin/*
```

## NPM scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run db:push      # sync schema to Neon database
npm run db:seed      # insert demo data
npm run db:studio    # open Prisma Studio GUI
```

## Environment variables

All in `.env` (gitignored):

```
DATABASE_URL=           # Neon pooled connection string
NEXTAUTH_URL=           # http://localhost:3000 (dev) / https://domain.com (prod)
NEXTAUTH_SECRET=        # openssl rand -base64 32
ADMIN_PASSWORD=         # admin panel password
RESEND_API_KEY=         # from resend.com
RESEND_FROM_EMAIL=      # sender address
CONTACT_TO_EMAIL=       # ganapathiramanaz1@gmail.com
```

## Design

- Dark bg: `oklch(0.08 0 0)` (~#0a0a0a)
- Primary/accent: violet `oklch(0.606 0.25 293)`
- Font: Geist Sans / Geist Mono (via `next/font/google`)
- Theme tokens are CSS variables in `src/app/globals.css`, forced dark mode via `dark` class on `<html>`

## API response convention

All admin API routes return `{ data: T }` on success and `{ error: string | ZodFlattenError }` on failure with appropriate HTTP status codes.

## Auth pattern

- Edge middleware (`middleware.ts`) blocks `/admin/*` and `/api/admin/*` for unauthenticated requests
- Each API route also calls `getServerSession(authOptions)` as a belt-and-suspenders check
- Server Components in `/admin` call `getServerSession(authOptions)` directly
- Client Components use `useSession()` from `next-auth/react` (wrapped by `SessionWrapper` in admin layout)

## See also

- `SETUP.md` — full step-by-step guide to set up, test, and deploy
