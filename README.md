# nyanopan Storefront

A demo e-commerce storefront for hand felted wool slippers from Nepal,
built as a front-end replica of a wool felt slipper reference storefront.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4 with shadcn/ui design tokens
- shadcn/ui components on Radix primitives
- TanStack Query (React Query) for server-state
- Sonner for toast notifications
- Zod for form and query-parameter schemas
- Lucide for icons
- Photography from Unsplash (Unsplash License)

## Structure

```
src/
  app/                  routes (home, collections, products, cart, checkout,
                        legal, login, register, forgot-password,
                        reset-password, account)
  components/
    layout/             header, announcement bar, footer, drawers
    home/               hero and category tiles
    partials/           reusable page sections (fair trade, comfort, ...)
    collection/         grid, card, filters, sort
    product/            gallery, buy box, size guide, related products
    account/            account navigation, address form dialog
    shared/             breadcrumbs, page headers, prose pages
    ui/                 shadcn/ui primitives
  config/               site configuration
  data/                 static catalog (products, collections, images)
  hooks/                use-cart, use-auth, use-orders, use-wishlist,
                        use-recently-viewed, use-products (React Query)
  lib/                  api layer, auth, orders, formatting, utils,
                        zod schemas
  types/                domain types (Product, Collection, User, Order, ...)
```

## Notable decisions

- The catalog is static and fully prerendered (`generateStaticParams`
  plus `dynamicParams = false`), so every product and collection is SSG.
- React Query drives collection browsing, product search and related
  products, with the static data as initial data and a simulated network
  latency so loading states behave like a real API.
- The cart is an external store (useSyncExternalStore) persisted to
  localStorage. Nothing is sent to a server.
- Quick add on collection cards opens a compact colour and size picker
  without leaving the grid; the cart drawer stays closed and a toast
  confirms the add.
- Recently viewed products are kept locally (max eight slugs) and shown
  on product pages. No tracking, nothing leaves the browser.
- Accounts are a clearly labelled demo: registration with a one-time
  code, sign in, forgot and reset password (also one-time code based),
  profile updates, password change, order history, a wishlist and
  saved shipping addresses all live in localStorage (`nyanopan-auth-v1`,
  `nyanopan-orders-v1`, `nyanopan-wishlist-v1`). Passwords are salted
  and SHA-256 hashed with Web Crypto before storage and never leave the
  browser. Because there is no email service, the one-time codes are
  shown on screen inside a demo notice (a real backend would email
  them). `src/lib/auth.ts` and `src/lib/orders.ts` are the single
  swap points for a real backend later.
- Checkout is a form demo: it validates with Zod but does not process
  payments. That limitation is stated on the page. Shipping is
  calculated from the rates on the Shipping page, with free shipping
  from €150 shown as a progress bar in the cart. Orders placed while
  signed in are recorded locally and appear in Order History.
- Canonical URLs are emitted for the home page, every collection and
  every product via the `alternates` metadata field.
- Privacy policy and terms pages describe the demo honestly, including
  the fact that product photos load from the Unsplash CDN.

## Scripts

For local development, copy `.env.example` to `.env.local` before starting
Next.js. In PowerShell, run `Copy-Item .env.example .env.local`. The local
environment file is gitignored.

```bash
npm run dev       # start the development server
npm run build     # production build
npm run start     # serve the production build
npm run lint      # lint
npm test          # run the test suite (Vitest)
npm run test:watch  # run tests in watch mode
```

## Quality

- **Unit tests (Vitest)** cover the cart store, filtering and sorting,
  the shipping rules, form schemas, formatting helpers, the demo auth
  service (registration, sign in, profile, password, addresses), the
  demo order store and the wishlist store.
- **CI (GitHub Actions)** runs lint, tests and a production build on
  every push to main and every pull request. See `.github/workflows/ci.yml`.

## Deploying to Vercel

Production deployments are automated through GitHub Actions. Pull requests
run the quality checks; pushes to `main` deploy to Vercel after all checks
pass.

1. Push the project to a Git repository (GitHub, GitLab or Bitbucket).
   If this folder is not a repository yet, run `git init` and commit first.
2. Create or import the project in Vercel. Set `NEXT_PUBLIC_BACKEND_URL` to
   the backend origin used by API requests and the Content Security Policy.
   The canonical URL can be set explicitly
   with `NEXT_PUBLIC_SITE_URL`; if omitted, the app derives it from Vercel's
   own environment variables (`VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL`).
3. In GitHub, add these repository Actions secrets under
   **Settings > Secrets and variables > Actions**:
   `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`. The Vercel IDs
   are available in the linked project's `.vercel/project.json` after running
   `vercel link`.
4. If the repository is connected to Vercel's Git deployment integration,
   disable its automatic production deployment to avoid deploying each push
   twice. GitHub Actions owns production deployment.

After connecting a custom domain, set the canonical URL explicitly:

| Variable               | Purpose                                    | Required |
| ---------------------- | ------------------------------------------ | -------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL (e.g. the custom domain) | No (falls back to the Vercel URL) |
| `NEXT_PUBLIC_BACKEND_URL` | Backend origin for API requests and CSP | Yes |

See `.env.example`. CI checks use these example values; Vercel production
builds load the project's configured environment with `vercel pull`.
`NEXT_PUBLIC_SITE_URL` can be omitted on Vercel; `NEXT_PUBLIC_BACKEND_URL` is
required.

### Launch checklist

Already in place in this codebase:

- Custom favicon (`src/app/icon.svg`, monogram)
- Privacy Policy page (`/privacy-policy`)
- Terms and Conditions page (`/terms-conditions`)
- No "Made with ..." tag anywhere
- robots.txt and sitemap.xml generated from the catalogue
- Security headers (CSP, nosniff, frame options, referrer policy)

To do at launch time (requires your accounts and credentials):

- Connect the custom domain in Vercel and set `NEXT_PUBLIC_SITE_URL`
- Replace `support@nyanopan-store.example` with a real support address
- Connect a payment provider (the checkout is a demo form today)
