# Élan Fashion Ecommerce MVP

Phase 1 architecture for an English-language women’s fashion storefront with TND pricing.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Local typed mock data

## Structure

```text
src/
├── app/                 Routes, global layout, and page composition
├── components/
│   ├── cards/           Product, category, and box cards
│   ├── layout/          Header, navigation, announcement, and footer
│   ├── motion/          Reduced-motion-aware page transition
│   ├── sections/        Shared page and marketing sections
│   └── ui/              Reusable design-system primitives
├── data/                Typed mock catalog and merchandising data
└── lib/                 Shared types and formatting utilities
```

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Supabase

The app uses Supabase SSR clients for browser, Server Component, and
middleware access.

Create `.env.local` from `.env.example` and provide:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is intentionally not required yet. Add it only
when privileged server-only admin operations are implemented, and never expose
it through a `NEXT_PUBLIC_` variable.

The Supabase connection foundation is present. Catalog migrations, authentication
screens, admin tools, payments, persistent cart state, and real imagery are
implemented in later phases.
