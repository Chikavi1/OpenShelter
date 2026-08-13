# OpenShelter

OpenShelter is an open-source website for animal rescue organizations and pet adoption. It provides a pet catalog, individual adoption profiles with application forms, donation pages, contact pages, and the legal pages every shelter needs — ready to deploy in minutes.

Built with **Next.js 16**, **Tailwind CSS v4**, and **shadcn/ui**.

## License

OpenShelter is **open-source software**. It is free to download, use, modify, and deploy for any **non-profit animal welfare organization** — shelters, rescues, sanctuaries, and foster groups.

- ✅ Free to use, modify, and redistribute for non-profit organizations
- ❌ **Sale is prohibited** — you may not sell this project, modified or not
- ❌ **Commercial or for-profit use is not permitted**
- 📌 Usage is intended for **non-profit organizations** dedicated to animal welfare

Any redistribution must retain the original license notice.

## Features

- 🐾 **Pet catalog** — cards on the landing page linking to individual profiles
- 📋 **Adoption profiles** — photo gallery, details (age, size, sex, location), story, adoption requirements, and application form
- 💚 **Donations** — one-time donations via card, bank transfer (SPEI), or PayPal
- ✉️ **Contact** — organization contact details and a message form
- 📄 Legal pages — **Privacy policy** and **Terms & conditions**

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com)
- [lucide-react](https://lucide.dev) (icons)

## Prerequisites

- Node.js 20 or later
- npm or pnpm

## Installation

```bash
# Clone the repository
git clone https://github.com/Chikavi1/OpenShelter.git
cd OpenShelter

# Install dependencies (with pnpm)
pnpm install
# or with npm
npm install
```

## Configuration

Copy `.env.example` to `.env` and adjust the values to match your organization:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_NAME` | Organization name |
| `NEXT_PUBLIC_LOGO_URL` | Logo URL |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email |
| `NEXT_PUBLIC_CONTACT_PHONE` | Contact phone |
| `NEXT_PUBLIC_CONTACT_ADDRESS` | Organization address |
| `NEXT_PUBLIC_CONTACT_HOURS` | Business hours |

> The `.env` file must never be committed to the repository (it is in `.gitignore`). Only `.env.example` is versioned.

## Development

```bash
# Start the development server
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production

```bash
# Create a production build
pnpm build
# or
npm run build

# Serve the production build
pnpm start
# or
npm run start

# Lint the codebase
pnpm lint
# or
npm run lint
```

## Project Structure

```
app/
├── page.tsx                 # Landing: hero, pet catalog, donations, contact
├── layout.tsx               # Root layout with theme and fonts
├── globals.css              # Global styles and theme (Tailwind v4)
├── adopta/
│   ├── milo/page.tsx        # Milo's profile
│   ├── luna/page.tsx        # Luna's profile
│   ├── bruno/page.tsx       # Bruno's profile
│   └── nube/page.tsx        # Nube's profile
├── donar/page.tsx           # Donation page
├── contacto/page.tsx        # Contact page
├── privacidad/page.tsx      # Privacy policy
└── terminos/page.tsx        # Terms and conditions
```

## Adding a Pet

1. Create a profile at `app/adopta/<slug>/page.tsx`, following the structure of an existing profile (e.g. `milo`).
2. Add the pet to the `pets` array in `app/page.tsx` with its `slug` so it appears in the catalog.
3. Place the photos in `public/` and reference them from the profile gallery.

## Deployment

The site is fully static and requires no server. Deploy it on [Vercel](https://vercel.com), Netlify, Cloudflare Pages, or any host that supports Next.js.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request for bug fixes, improvements, or accessibility enhancements.

## Support

For questions about using OpenShelter, open an issue on GitHub.
