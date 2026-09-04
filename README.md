# POEM Data Room

A founder document data room, organized around the POEM Framework categories. Built with Next.js 16 (App Router), Postgres, and a password-gated auth layer.

## Configuration

The data room is protected by a single shared password. Before running the app, copy `.env.example` to `.env.local` and set:

- `DATAROOM_PASSWORD` — the password required to sign in.
- `SESSION_SECRET` — a random secret used to sign session cookies. Generate one with `openssl rand -base64 32`.
- `DATABASE_URL` — a Postgres connection string. Works with any Postgres provider (Vercel Postgres, Neon, Supabase, Railway, self-hosted, etc.) or a local instance for development. Tables are created automatically on first connection — no separate migration step.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

## Testing

```bash
npm run lint    # ESLint
npx tsc --noEmit  # Typecheck
npm test        # Vitest
npm run build   # Production build
```

All four run in CI on every pull request (see `.github/workflows/ci.yml`).

## Project structure

- `src/app/dataroom` — the main authenticated UI.
- `src/app/api` — document CRUD, search, and stats endpoints.
- `src/app/login` — the sign-in page and auth server actions.
- `src/lib/db.ts` — Postgres data access layer.
- `src/lib/session.ts`, `src/lib/auth-token.ts`, `src/lib/dal.ts` — session/auth primitives.
- `src/proxy.ts` — the route gate (this Next.js version renamed `middleware.ts` to `proxy.ts`).
