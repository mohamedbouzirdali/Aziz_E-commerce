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
- Local typed mock catalog remains the shop/product fallback data source
- Homepage sections read Supabase CMS content with a controlled mock fallback

Commands:

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:types
npm run db:validate
npm run auth:verify
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
src/components/account/        Authentication and account experiences
src/components/admin/          Protected admin workspace components
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
src/lib/auth/                  Auth form contracts, redirects, and role checks
docs/database-architecture.md  Planned commerce schema and admin architecture
supabase/migrations/           Versioned schema, security, and seed migrations
scripts/validate-supabase-migrations.sh  Disposable PostgreSQL migration test
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

- Responsive premium homepage with a full-width editorial banner hero directly
  below the unchanged site header
- Shop-by-rhythm merchandising section
- Categories, an expanded 8-item homepage product rail, one editorial story
  block, curated edit rail, boxes, and newsletter sections
- Native horizontal touchpad/swipe behavior for editorial rails
- Responsive shop filters, sorting, URL pagination at 20 products per page
- Product cards with wishlist, color preview, quick view, and selection actions
- Product detail, related products, lightbox, cart, wishlist, search, and boxes
- Full-height compact mobile navigation sidebar with inline Shop expansion
- Accessible dialogs, focus trapping, reduced-motion support, skeletons, and loaders
- Homepage section visibility, order, copy, editorial media, featured products,
  and featured boxes can be read from Supabase with a safe mock fallback
- Admin-only public homepage controls link directly to focused section editors
- Homepage storytelling is now more image-first, with a fixed hero-then-rail
  sequence and remote fashion-image fallbacks when CMS media has not been
  replaced yet
- Homepage spacing is intentionally calmer, with fewer hard section dividers and
  the redundant homepage best-sellers and service bands removed in favor of a
  more continuous editorial flow
- Shared buttons now expose built-in pending/loading states for form submits so
  uploads, saves, and sign-out actions visibly lock while work is in progress

Commerce state:

- Cart and wishlist are currently client-side MVP state
- No payment integration
- No persistent orders
- Email/password sign-in, sign-up, confirmation, recovery, update, and sign-out
  flows are implemented
- Authenticated account state is rendered server-side from verified claims
- Account access and signed-in account surfaces now use a more presentable
  premium layout for both customers and staff

Supabase:

- Connected project reference: `whmodhorpeivabfguhcm`
- Browser and request-scoped server clients exist
- Cookie-based session refresh middleware exists
- Local `.env.local` is ignored by Git
- Vercel Production and Development contain the public Supabase URL and
  publishable key
- Auth and Data API connectivity have been verified
- Versioned migrations now define the commerce schema, RLS, Storage policy, and
  deterministic storefront seed
- The migration suite passes a disposable PostgreSQL 17 execution and
  idempotency test through `npm run db:validate`
- Database TypeScript types are generated from that validated local schema
- Server-side role checks protect the complete `/admin/*` route shell
- Signed-out authorization boundaries pass `npm run auth:verify`
- Transactional RPCs manage compound product/variant, box/item, inventory,
  homepage ordering, and media deletion operations
- Protected administration is implemented for products, categories, collections,
  inventory, boxes, homepage sections/items, and media metadata/uploads
- Authenticated admins can replace image-only homepage placements directly from
  `/` through a responsive upload dialog backed by Storage, media metadata, and
  server-side role enforcement
- All four migrations are applied to hosted project `whmodhorpeivabfguhcm`
- The hosted schema has 21 RLS-enabled public tables, seeded catalog/CMS data,
  and the configured `catalog-media` bucket
- The owner Auth record has customer and admin roles; password setup was sent by
  email and must be completed before the first interactive admin session
- Confirmed test accounts exist for admin and customer authorization testing;
  their temporary passwords are intentionally not stored in the repository
- No service-role key is currently required or stored
- Missing public Supabase configuration now degrades to the mock storefront and a
  signed-out session instead of crashing middleware or server-rendered routes
- The stale `aziz-e-commerce-eight.vercel.app` duplicate redirects to the
  canonical Supabase-connected production domain
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
- Admin controls on the public homepage are role-gated, link to focused editors,
  and support direct replacement of frequently changed editorial imagery
- Historic order items snapshot names, prices, SKUs, and imagery
- Products and historical records are archived rather than destructively deleted

Implemented database foundation:

1. Profiles and protected user roles
2. Catalog, variants, inventory, media, boxes
3. Homepage CMS
4. RLS and Storage policies
5. Seed current mock data

Next application phase:

1. Complete the owner password setup email
2. Exercise product, inventory, box, homepage, and media writes through the live
   authenticated admin UI
3. Replace remaining mock shop and product-detail reads incrementally
4. Add persistent cart, wishlist, addresses, and order workflows

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

Complete the owner password setup email, then exercise the implemented
administration workflows through a real hosted Auth session. After that, replace
mock catalog reads incrementally, keeping the controlled fallback until each
storefront route is verified against hosted data.

## Execution Log

### 2026-06-16 — Homepage simplification and expanded product rail

- Expanded the homepage fashion rail from a tight 4-product set to an 8-piece
  sliding edit while preserving the image-first premium treatment
- Removed the redundant homepage best-sellers and service bands and softened the
  remaining section boundaries so the homepage reads more like one continuous
  editorial experience
- Tightened categories, shop-by-rhythm, editorial story, and boxes spacing to
  stay closer to the calmer premium composition now targeted for the storefront
- Validation: `npm run lint`, `npm run typecheck`, `npm run build`, local route
  verification on `/` including 8 visible homepage product cards
- Commit: current commit containing this entry
- Production: deployed to `https://aziz-e-commerce.vercel.app`

### 2026-06-16 — Reference-aligned hero and 4-item homepage rail

- Rebuilt the top of the homepage to follow the requested structure more
  closely: unchanged header, full-width banner hero, then a 4-item image-first
  product section immediately underneath
- Added remote fashion-image fallbacks for the hero and homepage rail while
  preserving existing admin/CMS image replacement paths
- Forced the public homepage to use the intended section order even when older
  CMS ordering still exists, and added compatibility handling for stale hero and
  product-rail default copy
- Verified local desktop and mobile behavior, including a 390px breakpoint check
  confirming a 2-column mobile product layout and no horizontal overflow
- Validation: `npm run lint`, `npm run typecheck`, `npm run build`, local
  browser verification for `/`
- Commit: current commit containing this entry
- Production: pending deployment

### 2026-06-16 — Image-led homepage direction and stronger homepage media admin

- Reworked the homepage toward a more premium image-first structure with a large
  banner hero, calmer category storytelling, one curated horizontal product rail,
  and an editorial mosaic in place of the older dense product-heavy layout
- Kept homepage product selection admin-driven while making surrounding sections
  friendlier to media-based storytelling
- Improved homepage image administration with clearer inline edit affordances,
  direct access back to the homepage manager, and labeled section placements in
  the admin editor so image slots are easier to understand and maintain
- Validation: `npm run lint`, `npm run typecheck`, `npm run build`, local
  runtime verification for `/` and `/admin/homepage`
- Commit: current commit containing this entry
- Production: pending deployment

### 2026-06-14 — Admin and account interface refinement

- Simplified the admin dashboard and homepage section editor so frequent actions
  are clearer and less visually dense
- Refined the signed-out and signed-in account experiences with stronger layout,
  clearer status cues, and better-presented customer/staff actions
- Integrated automatic pending/loading button states for shared submit buttons so
  uploads, saves, and sign-out actions disable during execution and reduce
  duplicate submissions
- Validation: `npm run lint`, `npm run typecheck`, `npm run build`, local app
  route verification for `/account` and `/admin`
- Commit: current commit containing this entry
- Production: pending deployment

### 2026-06-14 — Inline homepage image editing

- Added admin-only `Change image` controls to 19 CMS-backed homepage placements
- Kept the sticky navigation above all inline homepage edit controls while
  preserving higher layers for drawers and dialogs
- Added a responsive upload dialog with image preview, required alt text,
  validation, progress feedback, and reduced-motion-compatible transitions
- Added a protected server action that registers the upload, updates the exact
  homepage placement, revalidates storefront content, and removes an old media
  asset when it is no longer referenced
- Verified desktop and mobile admin controls and confirmed customer accounts see
  no editing controls
- Verified lint, typecheck, production build, database migration validation, and
  authentication boundary checks
- Redirected the stale `-eight` Vercel duplicate to canonical production so
  authentication and inline editing always use the configured Supabase project

### 2026-06-14 — Hosted Auth role verification

- Created confirmed `admin.test@elan.tn` and `customer.test@elan.tn` test accounts
- Assigned the admin account `customer` and `admin` roles; the customer account
  has only the `customer` role
- Verified password authentication against hosted Supabase
- Verified the admin account reaches the live admin workspace and database totals
- Verified the customer account is denied `/admin` and redirected with the
  `staff-required` notice

### 2026-06-14 — Duplicate Vercel deployment resilience

- Traced `aziz-e-commerce-eight.vercel.app` to a duplicate Vercel ownership
  context that serves the same assets but lacks the active project's Supabase
  environment configuration
- Made middleware session refresh, server auth detection, and client-side admin
  controls tolerate missing public Supabase variables
- Verified lint, typecheck, configured production build, and a production build
  with `.env.local` removed
- Verified `/`, `/shop`, `/account`, `/admin`, and `/robots.txt` return HTTP 200
  in the no-environment production smoke test

### 2026-06-14 — Hosted Supabase activation

- Applied all four validated migrations to project `whmodhorpeivabfguhcm`
- Verified migration history, 21/21 RLS-enabled public tables, public catalog
  reads, private inventory behavior, seed counts, Storage bucket configuration,
  and hosted admin-role claims
- Created the owner Auth record, assigned the admin role, and sent the standard
  password-setup email without storing or reusing the database password
- Verified repeated production HTTP 200 responses, core routes, live browser
  rendering, signed-out admin redirect, and zero Vercel/browser runtime errors
- Commit: documentation commit containing this entry
- Production: `https://aziz-e-commerce.vercel.app` healthy; no redeploy required

### 2026-06-13 — Catalog administration and homepage CMS

- Added transactional product/variant, inventory, box, homepage ordering, and
  media deletion operations with expanded migration/RLS validation
- Added protected CRUD for products, taxonomies, inventory, boxes, homepage
  sections/items, and the Storage-backed media library
- Added admin-only storefront edit controls and database-backed homepage content
  with a controlled mock fallback
- Validation: database type generation, disposable PostgreSQL migration suite,
  lint, typecheck, production build, auth boundary suite, and desktop/mobile
  browser checks including native horizontal and vertical rail scrolling
- Commit: `3bf25f1`
- Production: deployed to `https://aziz-e-commerce.vercel.app` and smoke tested;
  hosted Supabase schema remains unchanged until project-owner migration access
  is available

### 2026-06-13 — Authentication and protected admin shell

- Generated typed Supabase clients directly from the validated migration schema
- Added sign-in, sign-up, email confirmation, password recovery/update, sign-out,
  and authenticated account states
- Added centralized verified-claim and role checks plus protected admin routes
- Added responsive admin navigation, live overview metrics, and management routes
- Validation: database types, database migration suite, auth boundary suite, lint,
  typecheck, production build, and desktop/mobile browser checks
- Commit: implementation commit containing this entry
- Production: staff tools remain inactive until hosted migrations and the first
  admin role are applied

### 2026-06-13 — Commerce database foundation

- Added versioned schema, RLS/Storage, and deterministic storefront seed migrations
- Added roles, catalog variants, inventory, boxes, homepage CMS, and audit logging
- Added `npm run db:validate` with PostgreSQL execution, idempotency, count, RLS,
  public catalog, and private inventory checks
- Validation: `npm run db:validate`, lint, typecheck, and production build
- Commit: implementation commit containing this entry
- Production: hosted Supabase migrations intentionally not applied because the
  active CLI account does not own the project

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
