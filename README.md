# Product Admin Dashboard

An admin dashboard to manage products, built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **Axios**, using the free [DummyJSON API](https://dummyjson.com). Users log in, browse products with pagination/search/filter/sort, view details, and add/edit/delete products.

**Live demo:** _add your Vercel link here after deploying_

---

## Tech stack

| Tool | Version |
| --- | --- |
| Next.js (App Router) | 16.3.6 |
| React | 19.2.8 |
| Tailwind CSS | 4 |
| Axios | 1.20.0 |
| Node.js | 18.18+ (developed on 22.x) |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/shubhs7799/dummyjson-admin-dashboard.git
cd dummyjson-admin-dashboard
npm install
```

### 2. Environment variable

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

> This is the only variable needed. It is not secret; it just makes the API base URL configurable. The app falls back to `https://dummyjson.com` if it is missing.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Log in

Use the demo credentials (also pre-filled on the login form):

- **Username:** `emilys`
- **Password:** `emilyspass`

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

---

## Features (what is finished)

- [x] **Login** with `POST /auth/login`, error messages for wrong details, and a logout button
- [x] **Route protection** — product pages require login; unauthenticated users are redirected to `/login`
- [x] **Product list** — image, title, category, price, rating and stock; **table on desktop, cards on mobile**
- [x] **Loading / empty / error states** — spinner while loading, empty message, and a **Retry** button on failure
- [x] **Server-side pagination** via `limit` and `skip`; page numbers, Previous/Next, page size (10/20/50), and "Showing X–Y of N" text
- [x] **Debounced search** (`/products/search?q=`) that waits until typing stops and resets to page 1
- [x] **Race-condition handling** — every request uses an `AbortController`; stale responses can never overwrite newer ones
- [x] **Category filter** (`/products/categories`) and **sort** by price, rating or title
- [x] **URL state** — page, search, filter and sort live in the query string, so refresh and share reproduce the same view
- [x] **URL validation** — bad values like `?page=abc` or `?page=999` do not break the page
- [x] **Product details** at `/products/[id]` with image gallery, description, price, specs and reviews, plus a **not-found** page for bad ids
- [x] **Add / edit** product form with validation and double-submit prevention
- [x] **Delete** with a confirm popup and immediate local UI update
- [x] **One shared Axios instance** that attaches the token to every request and handles errors in one place

---

## Project structure

```
src/
  app/
    login/page.js              Login screen
    products/page.js           Product list (pagination, search, filter, sort, delete)
    products/new/page.js       Add product
    products/[id]/page.js      Product details
    products/[id]/edit/page.js Edit product
    layout.js                  Root layout + AuthProvider
    page.js                    Redirects to /login
  components/                  ProductList, Pagination, Filters, ProductForm,
                               ConfirmDialog, ImageGallery, StarRating, States, ProtectedRoute
  context/AuthContext.js       App-wide auth state
  hooks/useDebounce.js         Debounce hook
  lib/axios.js                 Shared Axios instance (interceptors)
  lib/token.js                 Token storage helpers
  lib/productParams.js         URL param parsing + validation
  services/                    authService, productService (all API calls)
```

API calls live in `services/`, not in UI components. Components are kept small and focused.

---

## Notes on design decisions

**One shared Axios instance.** `src/lib/axios.js` creates a single instance with two interceptors: a request interceptor that attaches `Authorization: Bearer <token>` to every call, and a response interceptor that normalizes all errors into a consistent `{ status, message, data }` shape, clears the token on `401`, and passes canceled requests through cleanly. This keeps token and error logic in exactly one place.

**Race-condition-safe search.** Each fetch creates an `AbortController` and stores it in a ref. When a new fetch starts, it aborts the previous one, so a slow response for an old query can never call `setState` after a newer query has resolved. Canceled requests are detected via `axios.isCancel()` and ignored silently. (Tested with `&delay=2000`.)

**Search vs. category filter.** The DummyJSON API cannot search and filter by category at the same time — there is no combined endpoint. **Decision: search takes priority.** When a search query is present, the category dropdown is disabled and a short note explains why. When search is empty, category filtering works normally. Sorting works in all modes.

**URL as the source of truth.** Page, page size, search, category and sort are all stored in the query string and validated on read (`src/lib/productParams.js`). Invalid values (`?page=abc`, `?page=999`, unknown category/sort) fall back to safe defaults, so the page never breaks. Refreshing or sharing a link reproduces the exact same view.

**Add / edit / delete are not persisted by the API.** DummyJSON simulates these operations and returns a success response but does not actually save changes. **Approach:** call the real endpoints, then reflect the result in the UI — new/edited items show a success message, and deletes are removed from the local list immediately. Each screen clearly notes that the change is not saved server-side and will not survive a refresh.

**Double-submit prevention.** Login, Save (add/edit) and the delete confirm button all guard with an `if (submitting) return;` check and a `disabled` state while a request is in flight, so rapid clicks cannot fire multiple requests.

**No forbidden libraries.** No React Query, SWR, or ready-made table/pagination libraries. Pagination, debouncing, and request cancellation are all written by hand.

---

## A problem I faced and how I fixed it

**Problem:** In production builds, the app failed with a "Missing Suspense boundary with `useSearchParams`" error. The product list reads its state from the URL via `useSearchParams`, and in Next.js (App Router) that hook must be inside a `<Suspense>` boundary or the static build bails out.

**Fix:** I wrapped the product list content component in a `<Suspense>` boundary with a loading fallback. After that, `npm run build` passed cleanly. I confirmed the requirement in the Next.js docs before applying the fix.

A second, related issue: canceled (aborted) requests were initially being reported as generic "network errors" because an aborted Axios request still has an `error.request` object. I fixed this by checking `axios.isCancel(error)` first in the response interceptor and returning a dedicated `{ canceled: true }` result that the UI ignores.

---

## Where AI helped

AI was used to speed up scaffolding, draft repetitive UI (Tailwind markup for the table/cards/forms), and suggest the structure of the Axios interceptors and the URL-validation helper. Every line was reviewed and is understood — I verified the DummyJSON response shapes with real requests, confirmed the Next.js Suspense requirement in the official docs, and tested each feature in the browser before committing.

---

## Deployment

Deployed on **Vercel**. To deploy your own copy:

1. Push the repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the environment variable `NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com`.
4. Deploy. Vercel auto-detects Next.js — no extra config needed.
