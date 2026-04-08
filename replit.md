# Workspace

## Overview

Wheelhouse Tattoo Co. — a multi-tenant tattoo platform with three apps backed by a shared PostgreSQL + Express API.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + TanStack Query
- **Backend**: Express 5 + Drizzle ORM + PostgreSQL
- **Auth**: Clerk (via `@clerk/express` on server, `@clerk/react` on clients)
- **Routing**: wouter
- **API**: Contract-first OpenAPI → codegen (Orval) → typed hooks + Zod schemas

## Artifacts

| Artifact | Path | Description |
|---|---|---|
| `wheelhouse-tattoo` | `/` | Marketing landing page — dark, atmospheric |
| `customer-portal` | `/customer/` | Browse artists, book appointments, manage profile |
| `artist-portal` | `/artist/` | Manage profile, services, and bookings |
| `api-server` | API only | Express REST API (port 8080) |

## Database Schema

Tables in PostgreSQL (managed with Drizzle, schema in `lib/db/src/schema/`):

- **artists** — artist profiles (clerkId, name, bio, email, state, city, styles[], portfolioImages[], hourlyRate, available, instagramHandle, yearsExperience)
- **customers** — customer profiles (clerkId, name, email, phone)
- **services** — artist service offerings (artistId, name, description, price, durationMinutes, category)
- **bookings** — bookings (customerId, artistId, serviceId, status, scheduledAt, notes, totalPrice)

Seed data: 3 artists (Marcus Webb/TX, Priya Nakamura/CA, Diego Reyes/IL), 4 services each.

## API Endpoints

All under `/api/`:

- `GET /healthz`
- `GET /artists` — filter by state, city, style
- `GET /artists/locations`
- `GET /artists/me` (auth)
- `PUT /artists/me` (auth)
- `GET /artists/:id`
- `GET /artists/:id/services`
- `POST /services` (auth)
- `GET /services/mine` (auth)
- `PATCH /services/:id` (auth)
- `DELETE /services/:id` (auth)
- `GET /bookings` (auth)
- `POST /bookings` (auth)
- `GET /bookings/:id` (auth)
- `PATCH /bookings/:id/status` (auth)
- `GET /customers/me` (auth)
- `PUT /customers/me` (auth)
- `GET /dashboard/artist` (auth)
- `GET /dashboard/customer` (auth)

## Key Files

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/src/generated/api.ts` — generated React hooks
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas
- `artifacts/api-server/src/app.ts` — Express app (Clerk middleware wired)
- `artifacts/api-server/src/routes/` — route handlers (artists, services, bookings, customers, dashboard)
- `lib/db/src/schema/` — Drizzle schema files

## Auth Notes

- Clerk proxy middleware at `/__clerk` path in api-server (production only)
- `requireAuth` middleware uses `getAuth(req)` from `@clerk/express`
- Both portals use `ClerkProvider` with wouter `routerPush`/`routerReplace` integration
- Sign-in/sign-up routes use full base path for Clerk's `routing="path"`
- Do NOT use `setAuthTokenGetter` for web apps — cookies work automatically

## Running Locally

All workflows auto-start:
- `artifacts/api-server: API Server` — builds and starts Express
- `artifacts/wheelhouse-tattoo: web` — Vite dev server at `/`
- `artifacts/customer-portal: web` — Vite dev server at `/customer/`
- `artifacts/artist-portal: web` — Vite dev server at `/artist/`
