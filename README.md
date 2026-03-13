# Diesel AI

AI-powered insights platform for fuel station operators.

## Tech Stack

- **Next.js 14** — App Router
- **TypeScript**
- **Tailwind CSS**
- **Supabase** — Auth + Database
- **OpenAI** — Insight generation (Phase 2)
- **SendGrid** — Email notifications (Phase 2)
- **Twilio** — SMS alerts (Phase 2)
- **Stripe** — Billing (Phase 2)

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd diesel-ai-app
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `OPENAI_API_KEY` | OpenAI API key |
| `SENDGRID_API_KEY` | SendGrid API key |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

### 3. Supabase database

1. Open your Supabase project SQL editor
2. Copy and run the contents of `supabase/schema.sql`
3. This creates all tables with RLS policies enabled

### 4. Install Supabase client

```bash
npm install @supabase/supabase-js
```

### 5. Run development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  layout.tsx        # Root layout with fonts
  page.tsx          # Redirects to /dashboard
  login/page.tsx    # Auth page
  dashboard/page.tsx
  locations/page.tsx
  settings/page.tsx
components/
  Logo.tsx          # Reusable logo (sm/md/lg)
  NavBar.tsx        # Top navigation
  Sidebar.tsx       # Left sidebar nav
lib/
  supabase.ts       # Supabase client
  openai.ts         # OpenAI stub
types/
  index.ts          # TypeScript types
supabase/
  schema.sql        # DB schema + RLS policies
```

## Pages

| Route | Description |
|---|---|
| `/login` | Email/password + magic link auth |
| `/dashboard` | Today's insights feed + quick stats |
| `/locations` | Location management |
| `/settings` | Account, notifications, plan |

## Wiring Auth (Next Steps)

In `app/login/page.tsx`, uncomment the Supabase auth calls and add middleware to protect routes:

```ts
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
```
