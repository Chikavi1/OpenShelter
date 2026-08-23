# OpenShelter

OpenShelter is a single-organization animal rescue and adoption platform built with Next.js, PostgreSQL, and Drizzle ORM.

## What It Includes

- Public website for the rescue
- Pet catalog and adoption detail pages
- Adoption application flow
- Donation page
- Recognition page for supporters
- Events page and event detail view
- Adoption follow-up and contract tracking in the admin dashboard
- Dashboard for pets, applications, foster homes, thanks, events, and settings

## Tech Stack

- Next.js 16 (App Router)
- React 19
- PostgreSQL
- Drizzle ORM
- Tailwind CSS v4

## Requirements

- Node.js 20+
- PostgreSQL 15+
- npm

## Installation

### Local

```bash
git clone <your-repo-url>
cd adopt-me
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open `http://localhost:3000`.

### Docker

```bash
git clone <your-repo-url>
cd adopt-me
cp .env.example .env
docker compose up -d --build
```

Then open `http://localhost:3000`.

## Environment Variables

Required:

- `DATABASE_URL`
- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional:

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

## Usage

### Public Site

- Home page: landing and featured pets
- Catalog: browse all pets
- Adopt: view pet profiles and submit adoption applications
- Donate: see configured donation methods
- Recognition: view public supporter acknowledgements
- Events: browse upcoming rescue events
- Contact: rescue contact information

### Admin Dashboard

The dashboard includes:

- Overview
- Pets
- Adoption applications
- Foster homes
- Acknowledgements
- Adoption follow-ups
- Contracts
- Events
- Settings

### Contracts

- Open an adoption follow-up from the dashboard
- Use the contract preview page to review the document
- Download or print the contract PDF

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run db:setup
```

## Project Structure

- `app/` - Next.js routes and API endpoints
- `components/` - shared UI and dashboard modules
- `lib/` - auth, storage, database, and shared helpers
- `migrations/` - SQL migrations
- `public/` - static assets

## Notes

- Admin authentication uses a signed HttpOnly cookie.
- Dashboard data is persisted in PostgreSQL.
- Uploaded files use local storage by default or an S3-compatible provider.
- The app is designed for one organization, not multi-tenant use.

## License

Add your preferred license before publishing.
