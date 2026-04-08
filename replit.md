# Workspace

## Overview

Wheelhouse Tattoo Co. — a mobile tattoo fleet platform with four apps backed by a shared PostgreSQL + Express API. Wheelhouse operates across TN, TX, AZ, OK, and FL, deploying mobile tattoo rigs to concerts, festivals, and events.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + TanStack Query + framer-motion
- **Backend**: Express 5 + Drizzle ORM + PostgreSQL
- **Auth**: Clerk (via `@clerk/express` on server, `@clerk/react` on artist portal only)
- **Routing**: wouter
- **API**: Contract-first OpenAPI → codegen (Orval) → typed hooks + Zod schemas
- **API spec version**: 0.2.0

## Artifacts

| Artifact | Path | Description |
|---|---|---|
| `wheelhouse-tattoo` | `/` | Marketing landing page — dark/cinematic, Ink Meets The Road |
| `customer-portal` | `/customer/` | Event planners submit booking inquiries (no auth required) |
| `artist-portal` | `/artist/` | Artists sign up for events first-come-first-served (Clerk auth) |
| `admin-portal` | `/admin/` | Internal ops — manage artists, inquiries, events, rigs (no auth) |
| `api-server` | API only | Express REST API (port 8080) |

## Business Model

- **Packages**: A = 3 rigs (concerts, festivals, upscale), B = 2 rigs (parties, events), C = 1 rig (smaller events/pop-ups)
- **States**: TN, TX, AZ, OK, FL
- **Artist model**: Artists sign up for events (first-come-first-served) via artist portal
- **Customer model**: Event organizers submit inquiries, admin follows up

## Database Schema

Tables in PostgreSQL (managed with Drizzle, schema in `lib/db/src/schema/`):

- **artists** — artist profiles: clerkId, name, bio, email, phone, state, city, styles[], portfolioImages[], available, approved, instagramHandle, yearsExperience
- **events** — tattoo events: title, description, state, city, venue, packageType (A/B/C), eventDate, artistSlots, signedUpCount, status (open/full/completed/cancelled), notes
- **rigs** — mobile rigs: name, description, status (available/deployed/maintenance), currentEventId, homeState
- **inquiries** — customer booking requests: contactName, contactEmail, contactPhone, eventName, eventDate, eventState, eventCity, expectedAttendees, packageType, message, status (new/contacted/quoted/booked/declined), adminNotes
- **artist_event_signups** — junction: artistId, eventId, signedUpAt (unique constraint on artist+event)

OLD TABLES REMOVED: `services`, `bookings`, `customers`

## API Routes

All routes under `/api`:
- `GET /healthz`
- `GET /packages` — static package definitions (A/B/C)
- `GET/POST /inquiries` — customer inquiries
- `GET/PATCH /inquiries/:id`
- `GET/POST /events`
- `GET/PUT/DELETE /events/:id`
- `POST/DELETE /events/:id/signup` — artist event signup (auth required)
- `GET /events/:id/signups` — list signups for event
- `GET/PUT /artists/me` — artist profile (auth required)
- `GET /artists/me/events` — my signed-up events (auth required)
- `GET/POST /rigs`
- `PUT /rigs/:id`
- `GET /admin/dashboard`
- `GET /admin/artists`
- `PATCH /admin/artists/:id`

## Key Files

- `lib/api-spec/openapi.yaml` — OpenAPI 3.1 spec (v0.2.0)
- `lib/api-client-react/src/generated/api.ts` — generated React hooks
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas
- `lib/db/src/schema/` — Drizzle schema files
- `artifacts/api-server/src/routes/` — Express route handlers

## Auth Notes

- Customer portal: NO auth (public inquiry form)
- Artist portal: Clerk auth (sign in to sign up for events, manage profile)
- Admin portal: NO auth (internal tool, not exposed to public)
- API server: Uses `@clerk/express` + `clerkMiddleware()`, `requireAuth` middleware for protected routes
- Do NOT use `setAuthTokenGetter` on web — cookies work automatically
- `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_CLERK_PROXY_URL` auto-provisioned

## Codegen

Run after any OpenAPI spec changes:
```
pnpm run --filter @workspace/api-spec codegen
```

## DB Push

```
pnpm --filter @workspace/db run push
```
(Use executeSql directly if drizzle-kit push requires interactive prompts)
