# VPN Fornexteam Status

Real-time uptime monitoring for [VPN Fornexteam](https://vpn.fornexteam.com), published at [status-vpn.fornexteam.com](https://status-vpn.fornexteam.com) and powered by [UptimeRobot](https://uptimerobot.com).

The public site shows service status and incident history. The admin dashboard at `/admin` requires a Supabase Auth login.

## Features

- **Public status page** — Current state of every monitor, with a 90-day uptime bar
- **Incident history** — Downtime events with start time, end time, and duration
- **Admin dashboard** — Monitor list, response-time chart, alert contacts, and recent up/down events
- **Dark mode** — Toggle in the public header and in Settings, saved in localStorage
- **PWA** — Installable on desktop and mobile; the favicon and app icon come from `logo.png`

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | [TanStack Start](https://tanstack.com/start) v1 (SSR, file-based routing) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 + shadcn/ui |
| Charts | [Recharts](https://recharts.org) |
| Auth | [Supabase Auth](https://supabase.com/docs/guides/auth) via `@supabase/ssr` |
| Data | [UptimeRobot API v2](https://uptimerobot.com/api/) |
| Deploy | Vite + Nitro (`vercel` preset) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [UptimeRobot](https://uptimerobot.com) account with monitors set up
- A [Supabase](https://supabase.com) project for admin login

### Setup

```bash
npm install

cp .env.example .env.local
# Edit .env.local and fill in the values below

npm run dev
```

Open the local URL Vite prints (usually [http://localhost:8080](http://localhost:8080)).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `UPTIMEROBOT_API_KEY` | UptimeRobot Main API Key (My Settings → API Settings) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_...`). Used by the server to sign users in |
| `SUPABASE_SECRET_KEY` | Secret key (`sb_secret_...`). Server only; never expose it to the browser |

`.env` and `.env.*` are gitignored. `.env.example` is the only env file that should be committed.

### Admin users

Admin login is email and password through Supabase Auth. Create users in the Supabase dashboard under **Authentication → Users**. Turn off public signups if this dashboard should stay invite-only.

`/admin` redirects to `/login` when there is no session. The session is stored in an HTTP-only cookie.

## Project Structure

```
src/
├── components/
│   ├── AppShell.tsx            # Shared status UI helpers
│   ├── AdminShell.tsx          # Admin header and layout
│   └── ui/                     # shadcn/ui components
├── hooks/
│   └── use-dark-mode.ts        # Dark mode toggle + localStorage
├── lib/
│   ├── auth.server.ts          # Login, logout, and session lookup
│   ├── supabase.server.ts      # Supabase server client (cookie session)
│   ├── uptime-robot.server.ts  # UptimeRobot API client
│   └── dummy-data.ts           # Shared TypeScript types
├── routes/
│   ├── __root.tsx              # HTML shell, meta tags, favicon
│   ├── index.tsx               # Public status page
│   ├── incidents.tsx           # Public incident history
│   ├── login.tsx               # Admin login
│   └── admin/                  # Dashboard, monitor detail, alerts, settings
└── styles.css
public/
├── manifest.json
├── logo.png                    # Brand logo, used in light and dark mode
├── favicon.ico
├── favicon-32.png
└── apple-touch-icon.png
```

## UptimeRobot API

Monitor data is fetched on the server with `createServerFn`. The API key never reaches the browser.

| Function | Endpoint | Used on |
|----------|----------|---------|
| `fetchPublicMonitors()` | `getMonitors` + 90-day logs | Public status page |
| `fetchIncidentHistory()` | `getMonitors` + down logs | Incident history |
| `fetchMonitors()` | `getMonitors` | Admin dashboard |
| `fetchMonitorDetail(id)` | `getMonitors` + response times + logs | Monitor detail |
| `fetchAlertContacts()` | `getAlertContacts` | Alerts |
| `fetchRecentAlerts()` | `getMonitors` + logs | Alerts |

## Build

```bash
npm run build
npm run preview
```

## License

Internal tool — VPN Fornexteam. All rights reserved.
