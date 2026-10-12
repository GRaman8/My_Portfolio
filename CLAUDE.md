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
- **next-intl v4** — i18n in cookie mode (no `[locale]` routing). UI strings only; DB content not yet translated.

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
- For optional URL/email fields, use `z.union([z.string().url(), z.literal("")]).optional()` — NOT the old `.optional().or(z.literal(""))` chain which can fail on empty strings

### Null vs empty string in form resets
- Prisma returns `null` for unset optional fields; Zod schemas only accept `string | "" | undefined`
- Always convert null to `""` when calling `reset()` in admin forms:
  ```ts
  reset({ ...data, imageUrl: data.imageUrl ?? "", githubUrl: data.githubUrl ?? "" })
  ```
- Profile has `firstName`/`lastName` (not `name`) — public page combines them: `` `${profile.firstName} ${profile.lastName}` ``
- Already applied in: profile/page.tsx, projects/[id]/page.tsx, skills/[id]/page.tsx, certifications/[id]/page.tsx

### Admin route group (IMPORTANT)
- Admin login page lives at `src/app/admin/login/page.tsx` — OUTSIDE the `(protected)` group
- All other admin pages are in `src/app/admin/(protected)/` with their own layout
- This prevents the infinite redirect loop: `(protected)/layout.tsx` checks session and redirects to `/admin/login`, but since login is outside the group it has no layout and can't loop
- The middleware uses `withAuth({ pages: { signIn: "/admin/login" } })` and matcher `["/admin/((?!login$).*)", "/api/admin/:path*"]`

### External URLs in components
- Use `<a href={externalUrl} target="_blank">` for ALL external links — never `<Link href={externalUrl}>`
- Next.js `<Link>` is for internal navigation only; passing an external URL throws "illegal path"
- Hash-only anchors (`#hero`) must also use `<a>`, not `<Link>`

### Image upload
- `/api/upload` writes to `public/images/` — works in dev only
- Vercel filesystem is read-only at runtime — use URL mode in production
- Future improvement: migrate to `@vercel/blob`

### Next.js dynamic pages
- `src/app/page.tsx` and `src/app/admin/(protected)/dashboard/page.tsx` have `export const dynamic = "force-dynamic"` — intentional, they fetch from DB

### Environment variables
- Use single quotes for values containing `$` in `.env` (e.g., `ADMIN_PASSWORD='pass$word'`)
- Double-quoted values with `$` get shell-expanded by dotenv, truncating the value

### Internationalization (next-intl v4, cookie mode)
- No `[locale]` URL routing — locale lives in the `NEXT_LOCALE` cookie. Config: `src/i18n/config.ts` (locales en/de/es/ta), `src/i18n/request.ts` (`getRequestConfig` reads the cookie), `src/i18n/actions.ts` (`setLocale` server action). Plugin wired in `next.config.ts`.
- Message catalogs: `messages/{en,de,es,ta}.json` — all must share identical keys (49 currently). `LanguageSwitcher.tsx` sets the cookie + `router.refresh()`.
- `layout.tsx` is async: `getLocale()`/`getMessages()`, `<html lang={locale}>`, wraps children in `<NextIntlClientProvider>`. Client components use `useTranslations("ns")`; server components (Footer) use `await getTranslations("ns")`.
- Tamil: Geist lacks Tamil glyphs — `Noto_Sans_Tamil` loaded in layout, applied via `:lang(ta)` rule in `globals.css`.
- Dates: `formatDate`/`formatDateRange` in `utils.ts` take optional `locale` + `presentLabel`; pass `useLocale()` and `t("dates.present")` from components.
- Scope: UI strings only. DB-authored content is NOT translated (planned future phase — Google Cloud Translation, which supports Tamil; DeepL does not). Contact-form zod inline errors remain English.

### Animated background
- `src/components/BackgroundConstellation.tsx` (client, canvas) mounted in `page.tsx` (public site only, NOT root layout → keeps it off the admin CMS). `fixed inset-0 -z-10`.
- For the `-z-10` canvas to show, base `bg-background` moved from `body` to `html` in `globals.css` (opaque body bg would paint over a negative-z child). Body is now transparent.
- Red, theme-aware (reads `dark` class per frame); respects `prefers-reduced-motion` (static frame).

## Project structure

```
src/
  app/
    page.tsx                    ← Public portfolio (Server Component)
    layout.tsx                  ← Root layout, Geist font, theme script
    admin/
      login/page.tsx            ← NOT inside (protected) — no layout wraps it
      (protected)/              ← Route group — all pages here require session
        layout.tsx              ← Auth check + admin shell
        dashboard/page.tsx
        profile/page.tsx
        projects/page.tsx + [id]/page.tsx
        experience/page.tsx + [id]/page.tsx
        education/page.tsx + [id]/page.tsx
        certifications/page.tsx + [id]/page.tsx
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
      admin/certifications/route.ts + [id]/route.ts
      admin/skills/route.ts + [id]/route.ts
      admin/messages/route.ts + [id]/route.ts
  components/
    portfolio/                  ← Navbar, Hero, About, Projects, ProjectCard,
                                   Experience, Education, Certifications,
                                   Skills, Contact, ContactForm, Footer
    admin/                      ← AdminSidebar, AdminHeader, SessionWrapper,
                                   ConfirmDialog, BulletListEditor,
                                   TechStackInput, ImageUpload
    ui/                         ← shadcn/ui components
    ThemeToggle.tsx             ← Light/dark toggle (no next-themes dependency)
    LanguageSwitcher.tsx        ← Locale dropdown (next-intl, NEXT_LOCALE cookie)
    BackgroundConstellation.tsx ← Animated red canvas background (public page only)
  i18n/
    config.ts                   ← locales (en/de/es/ta), defaultLocale, localeNames
    request.ts                  ← getRequestConfig — reads NEXT_LOCALE cookie
    actions.ts                  ← setLocale server action
  lib/
    prisma.ts                   ← Prisma singleton with pg adapter
    auth.ts                     ← NextAuth options
    resend.ts                   ← Resend client
    utils.ts                    ← cn(), formatDateRange(), formatDate(), buttonVariants re-export
    validations/                ← Zod schemas (profile, project, experience,
                                   education, certification, skill, contact)
prisma/
  schema.prisma                 ← 7 models: Profile (firstName/lastName),
                                   Project, Experience, Education,
                                   Certification, Skill, ContactMessage
  seed.ts                       ← Demo data
messages/                       ← en.json, de.json, es.json, ta.json (i18n catalogs)
middleware.ts                   ← NextAuth withAuth guard for /admin/*
```

## Public section order

Hero → About → Skills → Education → Certifications → Experience → Projects → Contact

## Theme system

- Default: light mode (white background)
- Toggle: Sun/Moon button in Navbar, implemented in `src/components/ThemeToggle.tsx`
- Persistence: `localStorage` key `"theme"`, anti-FOUC inline script in `layout.tsx`
- Dark class applied to `<html>` via JS, NOT hardcoded
- `antialiased` font smoothing applied in dark mode only (improves light mode readability)
- Base font size: `106.25%` (≈17px) for better readability
- Red primary in both modes: dark `oklch(0.606 0.22 25)`, light `oklch(0.55 0.22 25)`

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
ADMIN_PASSWORD=         # admin panel password (use single quotes if it contains $)
RESEND_API_KEY=         # from resend.com
RESEND_FROM_EMAIL=      # sender address (onboarding@resend.dev works for dev)
CONTACT_TO_EMAIL=       # ganapathiramanaz1@gmail.com
```

## Design

- Light bg: `oklch(1 0 0)` (white), Dark bg: `oklch(0.08 0 0)` (~#0a0a0a)
- Primary/accent: red — light: `oklch(0.55 0.22 25)`, dark: `oklch(0.606 0.22 25)`
- Font: Geist Sans / Geist Mono (via `next/font/google`)
- Muted foreground (light mode): `oklch(0.40 0 0)` — darker than shadcn default for readability
- Theme tokens are CSS variables in `src/app/globals.css`

## API response convention

All admin API routes return `{ data: T }` on success and `{ error: string | ZodFlattenError }` on failure with appropriate HTTP status codes.

## Auth pattern

- Edge middleware (`middleware.ts`) — `withAuth({ pages: { signIn: "/admin/login" } })` blocks `/admin/(not login)` and `/api/admin/*`
- Each API route also calls `getServerSession(authOptions)` as a belt-and-suspenders check
- Server Components in `(protected)` call `getServerSession(authOptions)` directly
- Client Components use `useSession()` from `next-auth/react` (wrapped by `SessionWrapper` in admin layout)

## See also

- `SETUP.md` — full step-by-step guide to set up, test, and deploy
