English | [中文](README.cn.md)

# Mall User Template

A Vue 3 + Vite + TypeScript storefront for Mall Template, covering the whole shopping flow from browsing and checkout to payment, orders and refunds.

**Live demo:** https://mall.dreaifehebi.com (demo account `demo_user` / `123456`)

## Part of the Mall Template

Mall Template is split into four repositories that deploy together as a complete small store:

| Repository | Role |
| --- | --- |
| [mall-template-docs](https://github.com/dreaifeHebi/mall-template-docs) | Entry point: architecture overview and a Docker Compose setup for the whole stack |
| [mall-backend-template](https://github.com/dreaifeHebi/mall-backend-template) | Spring Boot backend: admin API (`mall-admin`) and storefront API (`mall-portal`) |
| [mall-admin-template](https://github.com/dreaifeHebi/mall-admin-template) | Admin console, talks to `mall-admin` |
| **mall-user-template** (this repo) | Storefront, talks to `mall-portal` |

To run everything together, start from [mall-template-docs](https://github.com/dreaifeHebi/mall-template-docs).

## Features

- Browsing: home page picks, product list with filters, new and best-selling products, product details, categories, brand list and brand pages
- Shopping: cart and order confirmation (shipping address, promotion amounts, item list)
- Payment: choose a payment method, create a payment, check its status or cancel it; the default local provider confirms payments itself, so checkout works without any third-party account
- Orders and after-sales: order list and details, cancel, confirm receipt, delete; refund requests, refund list and details
- Account: sign-up and sign-in, profile editing, password change, forgotten-password reset, email verification, shipping addresses
- Member activity: favorites, brand follows and browsing history (kept only in the current browser session when signed out)
- Content pages: about, contact, help center and ordering notes
- English UI by default, with an `EN / 中文` switch in the header

## Tech Stack

- Vue 3, Vue Router 4, Pinia
- Vite 6, TypeScript, vue-tsc
- Axios, Day.js
- Production image: built with Node 20, served as static files by Nginx 1.27

## Quick Start

You need Node.js 20 or newer, and the `mall-portal` backend running (it listens on `http://localhost:8085` by default; see [mall-backend-template](https://github.com/dreaifeHebi/mall-backend-template)).

```bash
npm install
```

Copy the example settings so the dev server forwards `/portal` requests to the backend (`.env.example` sets `VITE_API_BASE_URL=/portal` and `VITE_PROXY_TARGET=http://localhost:8085`):

```bash
cp .env.example .env.local
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:8060`. The demo account `demo_user / 123456` is created by the backend's database initializer, and the sign-in page can fill it in with one click.

Other commands:

```bash
npm run typecheck   # type check
npm run build       # type check and build into dist/
npm run preview     # preview the build locally (port 8060)
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Prefix the browser uses for storefront API requests; `/portal` when unset |
| `VITE_PROXY_TARGET` | Dev server only: `/portal` requests are forwarded here with the prefix removed |

- **Docker image**: the [`Dockerfile`](./Dockerfile) builds with `VITE_API_BASE_URL=/portal` by default, and [`deployment/nginx.conf`](./deployment/nginx.conf) forwards `/portal/` and `/uploads/` to `mall-portal:8085`. The full stack is set up in [mall-template-docs](https://github.com/dreaifeHebi/mall-template-docs).
- **Frontend and backend on different hosts**: set `VITE_API_BASE_URL` at build time to the full storefront API address, for example `VITE_API_BASE_URL=https://api.example.com/portal npm run build`.
- **Email links**: links in registration and password reset emails point to storefront routes; the storefront address comes from the backend's `FRONTEND_BASE_URL`.
- **GitHub Actions**: [`build-sync-s3.yml`](./.github/workflows/build-sync-s3.yml) runs only when triggered manually and only builds by default. Set the `deploy` input to `true` after configuring the secret `AWS_ROLE_ARN` and the variables `USER_API_BASE_URL`, `USER_S3_BUCKET` and `AWS_REGION`, and it syncs the build to an Amazon S3 bucket.

## Known Limitations

- The default local provider (`LOCAL_SELF`) marks orders as paid immediately; it is meant for demos and development. The backend includes GlobePay card, Alipay H5 and WeChat H5 code paths, but they are untested in the template; Stripe Checkout is a placeholder that needs a backend implementation first.
- Refund requests wait for review in the admin console; refunds to the original payment method also depend on a configured payment provider.
- Registration confirmation, password reset and email verification only send real emails once SMTP is configured in the backend.

## Development Notes

How the upstream UniApp storefront was ported to this version is recorded in [docs/migration-notes.md](./docs/migration-notes.md) (in Chinese).

## License

Licensed under the [Apache License 2.0](./LICENSE).

Derived from [macrozheng/mall](https://github.com/macrozheng/mall) and its storefront [macrozheng/mall-app-web](https://github.com/macrozheng/mall-app-web) (both Apache-2.0). Thanks to the original authors.
