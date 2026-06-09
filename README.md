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

This phase intentionally excludes backend services, authentication, payments, persistent cart state, and real imagery.
