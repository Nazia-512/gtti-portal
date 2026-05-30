# GTTI Smart Portal

## Project Overview
This is a Next.js web portal for GTTI. It includes an admin panel, job listings,
authentication, announcements, a slider, and a "shining stars" feature. PDF/QR
generation and document export are also part of the app.

## Tech Stack
- **Framework:** Next.js 14 (App Router) — pages live in `src/app`
- **Language:** TypeScript
- **Database/ORM:** Prisma (`@prisma/client` v5) — schema in `prisma/schema.prisma`
- **Auth:** NextAuth v4 + bcryptjs for password hashing
- **Styling:** Tailwind CSS (with `clsx` + `tailwind-merge`)
- **Forms/Validation:** react-hook-form + zod
- **UI/Animation:** framer-motion, lucide-react (icons), sonner (toasts)
- **Docs/PDF/QR:** docx, jspdf, react-to-pdf, html2canvas, qrcode, react-qr-code, file-saver
- **AI SDKs present:** @anthropic-ai/sdk, @google/generative-ai
- **Deployment:** Vercel

## Project Structure
- `src/app/` — Next.js App Router (pages + API routes)
  - `src/app/page.tsx` — home page
  - `src/app/layout.tsx` — root layout
  - `src/app/globals.css` — global styles (Tailwind)
  - `src/app/admin/` — admin panel pages (uses Prisma)
  - `src/app/api/` — backend API route handlers (uses Prisma)
  - `src/app/auth/` — authentication pages (login/register, NextAuth)
  - `src/app/student/` — student-facing pages
  - `src/app/jobs/` — job listings (uses Prisma)
  - `src/app/shining-stars/` — shining stars feature (uses Prisma)
  - `src/app/cv-builder/` — CV builder (PDF/QR generation)
- `prisma/` — schema + seed file (`prisma/seed.ts`)

## Commands
- `npm run dev` — start local dev server
- `npm run build` — production build (this is what Vercel runs)
- `npm run lint` — run ESLint
- `npx prisma generate` — regenerate Prisma client after schema changes
- `npx prisma migrate dev` — apply DB migrations locally

## Important Rules / Conventions
- Pages or API routes that use Prisma must NOT be statically pre-rendered at
  build time, or Vercel build fails with "Failed to collect page data".
  Add `export const dynamic = "force-dynamic";` to such pages/routes.
- `DATABASE_URL` must be set in Vercel Environment Variables, otherwise build/runtime fails.
- All database access goes through Prisma — do not write raw SQL unless asked.
- Validate all form/API input with zod.
- Use TypeScript types properly — avoid `any`.

## Things to ask before doing
- Before changing `prisma/schema.prisma`, confirm — schema changes need migrations.
- Before deleting or renaming files, confirm with me first.
- For big features, give me a plan first; don't write code until I approve.