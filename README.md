# Insighta Web Portal

A Next.js web portal for the Insighta Labs+ platform. Provides a visual interface for non-technical users to interact with demographic profile data.

---

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Axios (with auto token refresh)
- HTTP-only cookies for token storage
- Deployed on Vercel

---

## Authentication Flow

1. User clicks "Continue with GitHub" on `/login`
2. Redirected to `/auth/github` on the backend
3. GitHub OAuth flow completes
4. Backend sets HTTP-only cookies (`access_token`, `refresh_token`)
5. User redirected to `/dashboard`
6. On 401, axios interceptor auto-calls `/auth/refresh`
7. New tokens set in cookies, original request retried

---

## Token Handling

- Tokens stored in **HTTP-only cookies** — not accessible via JavaScript
- Access token: 60 minutes
- Refresh token: 5 minutes
- Auto-refresh handled by axios interceptor in `src/lib/api.ts`
- On failed refresh, user redirected to `/login`

---

## Pages

| Route | Description | Auth Required |
|---|---|---|
| `/login` | GitHub OAuth login | ❌ |
| `/dashboard` | Metrics overview | ✅ |
| `/profiles` | Filterable profile list | ✅ |
| `/profiles/[id]` | Profile detail view | ✅ |
| `/search` | Natural language search | ✅ |
| `/account` | User info + logout | ✅ |

---

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://insighta-api.vercel.app
```

---

## Live URL

https://insighta-web.vercel.app