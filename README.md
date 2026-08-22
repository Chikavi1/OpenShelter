# OpenShelter

OpenShelter is a self-hostable, vendor-independent animal rescue platform built with Next.js, PostgreSQL, and Drizzle ORM.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- PostgreSQL
- Drizzle ORM
- Tailwind CSS v4

## Quick Deploy

For cloud providers that run Node.js apps:

1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env` and fill in the production values.
3. Set `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Run `npm install`.
5. Run `npm run build`.
6. Start with `npm run start`.

The app works on any Node-hosting platform that supports Next.js, including Vercel, Render, Railway, Fly, and similar providers.

## Self-hosted

```bash
git clone <your-repo-url>
cd adopt-me
cp .env.example .env
docker compose up -d --build
```

Open `http://localhost:3000` once the containers are healthy.

The stack includes:

- PostgreSQL with a persistent volume
- Automatic migrations and seed data on startup
- Local storage at `/app/public/uploads` for persisted files

## Environment

Required variables:

- `DATABASE_URL`
- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional variables:

- `STORAGE_DRIVER`
- `STORAGE_LOCAL_DIR`
- `STORAGE_PUBLIC_BASE_URL`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_FORCE_PATH_STYLE`
- `S3_PUBLIC_URL`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run db:setup
```

## Notes

- Dashboard data is stored in PostgreSQL.
- Admin auth uses a signed HttpOnly cookie.
- Local file uploads are stored under the configured storage directory instead of the ephemeral filesystem.
