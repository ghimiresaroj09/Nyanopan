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
- **CI (GitHub Actions)** runs lint, TypeScript, tests, and a production build
  for pushes to `main` and pull requests targeting `main`. See
  `.github/workflows/deploy.yml`.

## Deploying to DirectAdmin / CloudLinux Passenger

Pull requests targeting `main` run ESLint, TypeScript, tests, and a production
standalone build. A successful push to `main` deploys automatically over SSH
and verifies the live release at `https://nyanopan.com`.

The workflow targets Node.js **24.22.3** and the existing application root
`/home2/nyanopan/nyanopan-storefront`. It creates an immutable directory under
`releases/<commit>-<run>-<attempt>` and atomically switches the `releases/current`
symlink only after validating the archive. It does not extract over the
application root; `.htaccess`, `Public`, `tmp`, and other existing root files
are left in place. Old releases are retained for rollback.

### DirectAdmin / Passenger setup

Keep the existing Passenger application root, virtual-environment Node binary,
and startup filename:

```apache
PassengerAppRoot "/home2/nyanopan/nyanopan-storefront"
PassengerBaseURI "/"
PassengerNodejs "/home2/nyanopan/nodevenv/nyanopan-storefront/24/bin/node"
PassengerAppType node
PassengerStartupFile app.js
```

The repository's `app.js` is a small production wrapper that loads
`releases/current/server.js`. On the first successful activation, the deploy
script preserves the existing server-side `app.js` at
`deploy-backups/app.js.before-standalone` before installing the wrapper. If
production verification fails, the workflow restores the previous release or,
on the first deployment, the original `app.js`, and restarts Passenger.
The deployment never removes `tmp`, `Public`, `.htaccess`, or prior releases.

In DirectAdmin, confirm the application is set to Node.js **24.22.3**, its root
matches the path above, startup file is `app.js`, and application mode is
production. Set `NODE_ENV=production`,
`NEXT_PUBLIC_SITE_URL=https://nyanopan.com`, and
`NEXT_PUBLIC_BACKEND_URL=https://api.nyanopan.com` in the app environment.
The `.htaccess` Passenger restart directory remains `tmp/`; deployments touch
`tmp/restart.txt`.

Passenger's documented Node.js auto-install mode intercepts the application's
first HTTP server `listen()` and binds it to a Passenger-managed Unix socket.
The generated Next.js standalone server uses one HTTP server and reads its
normal `PORT`/hostname settings; it does not create a separate listener in the
wrapper. This is compatible with Passenger's documented reverse-port-binding
model ([Passenger documentation](https://www.phusionpassenger.com/docs/advanced_guides/in_depth/node/reverse_port_binding.html)),
but the first deployment must still be observed on the actual
CloudLinux host. The remote `app.js` is not present in this repository, so the
workflow preserves it before replacement rather than assuming its contents.
Before enabling the first production push, inspect that server-side file over
SSH. The workflow retains an exact backup, but any host-specific startup logic
must be carried into the wrapper deliberately. The deploy preflight also stops
if the existing `app.js` is a symlink or has already been changed outside the
managed deployment process.

### GitHub Actions variables and secret

Under **Settings > Secrets and variables > Actions**, add these repository
variables:

| Variable | Purpose |
| --- | --- |
| `DEPLOY_HOST` | SSH hostname for the Himalayan Host server |
| `DEPLOY_USERNAME` | SSH account username |
| `DEPLOY_PORT` | Actual SSH port; required, with no SFTP-port assumption |
| `DEPLOY_PATH` | `/home2/nyanopan/nyanopan-storefront` |
| `DEPLOY_KNOWN_HOSTS` | Verified known-hosts line for the host and SSH port |
| `DEPLOY_APP_JS_REVIEWED` | Set to `true` after reviewing the current server-side startup file |
| `NEXT_PUBLIC_SITE_URL` | `https://nyanopan.com` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.nyanopan.com` |

Add `DEPLOY_SSH_PRIVATE_KEY` as a repository secret. Use a dedicated SSH key
with write access only to the application account/path where possible. Obtain
the SSH port and host-key fingerprint from Himalayan Host or the DirectAdmin
server administrator; do not infer the SSH port from SFTP (including port
8186), and compare any `ssh-keyscan` result against a trusted fingerprint
before saving it as `DEPLOY_KNOWN_HOSTS`. SSH runs with strict host-key
checking and `IdentitiesOnly=yes`. The workflow refuses deployment until
`DEPLOY_APP_JS_REVIEWED=true`, confirming that the existing server-side
`app.js` was inspected and any host-specific startup logic accounted for.

### Deployment validation and rollback

After activation, the workflow retries the production URL check. It requires
HTTP 200, Nyanopan page title and canonical URL, and a static deployment marker
matching the exact release ID; a DirectAdmin default page or a stale release
does not pass. Failed verification triggers rollback and Passenger restart.
Releases are not automatically pruned, so rollback copies are retained; remove
old release directories manually only after confirming they are no longer
needed. To manually roll back, choose a previous release ID under `releases/`,
then from the application root run:

```bash
ln -s PREVIOUS_RELEASE_ID releases/.current-manual-rollback
mv -Tf releases/.current-manual-rollback releases/current
touch tmp/restart.txt
```

Replace `PREVIOUS_RELEASE_ID` with the exact existing directory name. Actual
SSH deployment and CloudLinux socket behavior cannot be validated from a
local build. If you need to return to the pre-pipeline application after the
first deployment, restore the preserved startup file and remove only the
`current` symlink:

```bash
cp -p deploy-backups/app.js.before-standalone app.js
rm -- releases/current
touch tmp/restart.txt
```

Local checks:

```powershell
npm ci
$env:NEXT_PUBLIC_SITE_URL = "https://nyanopan.com"
$env:NEXT_PUBLIC_BACKEND_URL = "https://api.nyanopan.com"
npm run lint
npx tsc --noEmit
npm test
npm run build
Test-Path .next\standalone\server.js
Test-Path .next\standalone\node_modules\next\package.json
Test-Path .next\standalone\.next\static
Test-Path .next\standalone\public
```

On Linux, also check the deployment script with
`bash -n scripts/deploy-directadmin.sh`.

### Launch checklist

Already in place in this codebase:

- Custom favicon (`src/app/icon.svg`, monogram)
- Privacy Policy page (`/privacy-policy`)
- Terms and Conditions page (`/terms-conditions`)
- No "Made with ..." tag anywhere
- robots.txt and sitemap.xml generated from the catalogue
- Security headers (CSP, nosniff, frame options, referrer policy)

To do at launch time (requires your accounts and credentials):

- Configure the custom domain in DirectAdmin and set `NEXT_PUBLIC_SITE_URL`
- Replace `support@nyanopan-store.example` with a real support address
- Connect a payment provider (the checkout is a demo form today)
