# Élan Fashion Ecommerce MVP

Premium English-language women’s fashion storefront with TND pricing, Supabase
authentication, and a protected commerce administration foundation.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Postgres, Auth, Storage, and SSR clients
- Local typed mock data

## Structure

```text
src/
├── app/                 Routes, global layout, and page composition
├── components/
│   ├── cards/           Product, category, and box cards
│   ├── account/         Authentication and account experience
│   ├── admin/           Protected admin workspace components
│   ├── layout/          Header, navigation, announcement, and footer
│   ├── motion/          Reduced-motion-aware page transition
│   ├── sections/        Shared page and marketing sections
│   └── ui/              Reusable design-system primitives
├── data/                Typed mock catalog and merchandising data
└── lib/                 Shared utilities, auth checks, and Supabase clients

supabase/
└── migrations/          Schema, RLS/Storage, and deterministic storefront seed
```

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:types
npm run db:validate
npm run auth:verify
```

## Supabase

The app uses Supabase SSR clients for browser, Server Component, and
middleware access.

Create `.env.local` from `.env.example` and provide:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is intentionally not required. Authenticated admin
operations use the publishable key with server-side role checks and Postgres RLS.
Never expose a service-role key through a `NEXT_PUBLIC_` variable.

The repository contains validated catalog migrations, generated database types,
email/password authentication screens, recovery flows, and a server-protected
admin shell. The migrations must be applied to the hosted Supabase project before
staff roles and catalog administration can work against production data.
