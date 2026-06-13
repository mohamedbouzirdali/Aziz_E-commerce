# ÉLAN Project Context

Read this file before inspecting or changing the project. It is the canonical
summary of product intent, architecture, current status, and operating rules.

## Mandatory Context Maintenance

After completing any implementation plan:

1. Update **Current State** if capabilities or architecture changed.
2. Update **Active Next Phase** if priorities changed.
3. Add one concise entry to **Execution Log** with the date, outcome, validation,
   commit, and deployment status.
4. Update linked documentation when the implementation changes its assumptions.
5. Never add credentials, tokens, passwords, private keys, customer data, or
   unredacted environment values to this file.

Do this before the final response. Documentation-only brainstorming does not need
an execution entry unless it changes an agreed architecture.

## Product

ÉLAN is a premium English-language women’s fashion ecommerce storefront for
Tunisia. Prices use TND.

Brand direction:

- Premium, calm, modern, editorial
- Black, white, off-white, charcoal, subtle gray borders
- Editorial serif display typography with clean sans-serif UI typography
- Mobile-first and ecommerce-clear
- Motion is restrained and respects reduced-motion preferences
- Inspiration may come from premium fashion/activewear UX patterns, including
  Lululemon and Alo Yoga, but layouts, branding, text, and assets must remain
  original

Priority order:

1. Functional shopping flow
2. Mobile usability
3. Product discovery, filters, and search
4. Product detail and cart confidence
5. Admin-managed catalog and homepage
6. Editorial polish and motion

## Technology

- Next.js `15.5.19`, App Router
- React `19`
- TypeScript
- Tailwind CSS `4`
- Framer Motion
- Supabase Postgres, Auth, Storage, and SSR clients
- Vercel hosting and Web Analytics
- Local typed mock catalog remains the current storefront data source

Commands:

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Next.js Rule

This version can differ from older Next.js knowledge. Before changing framework
behavior, inspect the relevant local documentation in:

```text
node_modules/next/dist/docs/
```

The Supabase session middleware uses the supported Next.js 15.5 Node.js middleware
runtime.

## Repository Map

```text
src/app/                       App Router pages and global layout
src/components/cards/          Product, category, and box cards
src/components/commerce/       Cart, wishlist, and quick-view experiences
src/components/layout/         Header, desktop mega menu, mobile sidebar, footer
src/components/loaders/        Brand-aligned loading system
src/components/motion/         Shared reveal and page motion
src/components/product/        Product detail experience
src/components/sections/       Homepage and shared editorial sections
src/components/shop/           Shop listing, filters, sorting, pagination
src/components/ui/             Design-system primitives
src/data/                      Current typed mock catalog
src/lib/supabase/              Browser, server, config, and session helpers
docs/database-architecture.md  Planned commerce schema and admin architecture
```

## Current Routes

```text
/
/shop
/product/[slug]
/boxes
/boxes/[slug]
/cart
/wishlist
/account
/search
/about
/contact
/faq
/shipping
/returns
/privacy
```

Planned protected routes:

```text
/admin
/admin/products
/admin/categories
/admin/collections
/admin/inventory
/admin/boxes
/admin/homepage
/admin/media
/admin/customers
/admin/orders
/admin/settings
/admin/audit
```

## Current State

Storefront:

- Responsive premium homepage with editorial hero
- Shop-by-rhythm merchandising section
- Categories, new arrivals, best sellers, boxes, newsletter, and service sections
- Native horizontal touchpad/swipe behavior for editorial rails
- Responsive shop filters, sorting, URL pagination at 20 products per page
- Product cards with wishlist, color preview, quick view, and selection actions
- Product detail, related products, lightbox, cart, wishlist, search, and boxes
- Full-height compact mobile navigation sidebar with inline Shop expansion
- Accessible dialogs, focus trapping, reduced-motion support, skeletons, and loaders

Commerce state:

- Cart and wishlist are currently client-side MVP state
- No payment integration
- No persistent orders
- No production authentication UI yet

Supabase:

- Connected project reference: `whmodhorpeivabfguhcm`
- Browser and request-scoped server clients exist
- Cookie-based session refresh middleware exists
- Local `.env.local` is ignored by Git
- Vercel Production and Development contain the public Supabase URL and
  publishable key
- Auth and Data API connectivity have been verified
- No database migrations or Storage buckets have been created yet
- No service-role key is currently required or stored
- Preview environment variables are not configured because the Vercel project is
  not connected to its GitHub repository

Deployment:

- GitHub: `https://github.com/mohamedbouzirdali/Aziz_E-commerce`
- Production: `https://aziz-e-commerce.vercel.app`
- Vercel project: `aziz-e-commerce`
- Branch: `main`

## Database and Admin Direction

The agreed model is documented in
[`docs/database-architecture.md`](docs/database-architecture.md).

Core decisions:

- Products are merchandising records; sellable color/size combinations are
  variants
- Options are generic so future values such as length can be added
- Inventory is stored per variant and separately from product content
- Images live in Supabase Storage; metadata and usage references live in Postgres
- Homepage content uses structured `homepage_sections` and
  `homepage_section_items`
- Customers, editors, and admins use protected roles plus RLS
- Admin controls on the public homepage are visible only after a server-side role
  check and link to focused editors
- Historic order items snapshot names, prices, SKUs, and imagery
- Products and historical records are archived rather than destructively deleted

Target first implementation phase:

1. Profiles and protected user roles
2. Catalog, variants, inventory, media, boxes
3. Homepage CMS
4. RLS and Storage policies
5. Seed current mock data
6. Authentication UI
7. Protected admin product, media, and homepage CRUD
8. Admin-only homepage edit controls

## Authorization Rules

- Never rely on hidden admin buttons for security
- Never trust editable `user_metadata` for authorization
- Check editor/admin access server-side and in RLS
- The publishable key is expected in browser code and is protected by RLS
- A service-role key, if added later, must remain server-only and should be used
  only when a normal authenticated/RLS workflow cannot perform the operation
- Never expose a service-role key through `NEXT_PUBLIC_*`

## Data and UX Rules

- Keep product color variations grouped under one product
- Product cards must expose enough category-specific information for comparison
- Store meaningful commerce events through an allowlist; do not collect
  keystrokes, precise location, card data, or sensitive attributes
- Avoid duplicating Vercel page-view analytics
- Homepage CMS references products, boxes, and media instead of copying their data
- Require alt text for published media
- Preserve consistent image ratios and card geometry

## Editing and Validation

- Preserve the existing design system unless a task explicitly changes it
- Use established components before adding abstractions
- Keep mobile behavior and accessibility part of every UI change
- Use `apply_patch` for manual file edits
- Do not commit `.env.local`
- Run, at minimum:

```bash
npm run lint
npm run typecheck
npm run build
```

- For interactive changes, also run the app and verify the relevant route
- Do not push or deploy failing code

## Active Next Phase

Create and apply the first Supabase migration for:

- profiles
- user roles
- categories and collections
- products, options, values, variants
- inventory
- media metadata
- boxes
- homepage CMS
- RLS helper functions and policies
- Storage bucket policies

Required privileged access:

- Supabase CLI login plus database password, or
- Migration SQL executed through the Supabase SQL Editor

After migration, generate database TypeScript types and replace mock catalog reads
incrementally, keeping a controlled fallback during migration.

## Execution Log

### 2026-06-13 — Canonical project context

- Expanded `AGENTS.md` into the required onboarding and continuity document
- Added mandatory context-maintenance rules for every completed implementation plan
- Recorded architecture, deployment, Supabase state, conventions, and next phase
- Validation: documentation and secret scan
- Commit: documentation commit containing this entry
- Production: no deployment required

### 2026-06-13 — Supabase connection foundation

- Added Supabase browser/server clients and cookie session middleware
- Added safe environment documentation
- Configured Vercel Production and Development public variables
- Verified Auth, Data API, local build, and production deployment
- Commit: `a8c6436`
- Production: deployed

### 2026-06-13 — Database and admin architecture

- Defined commerce ER model, homepage CMS, roles, RLS boundaries, admin routes,
  event collection, indexing, and delivery phases
- Document: `docs/database-architecture.md`
- Implementation: pending migration access

### 2026-06-13 — Premium homepage merchandising

- Refined premium discovery, Shop-by-rhythm cards, best sellers, product-card
  hierarchy, navigation paths, and responsive behavior
- Latest relevant UI commit: `fc999c1`
- Production: deployed

### 2026-06-10 — Navigation and interaction stabilization

- Added full-height mobile sidebar, native horizontal rails, hover mega menu,
  filter drawer improvements, button affordance, and 20-item pagination
- Relevant commits: `15e0330`, `dec9af1`, `b1b0af1`
- Production: deployed

### 2026-06-09 — Initial MVP

- Created typed mock catalog, reusable UI, homepage, product/shop/cart/wishlist
  experiences, loaders, responsive layouts, Git repository, and Vercel deployment
- Initial commit: `e33591d`
- Production: deployed
