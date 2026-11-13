# D-Right Technologies (Astro SSR)

Astro + Node standalone server for the marketing site. Homepage and MGW are migrated; demo requests POST to `/api/demo` (logged server-side, no database).

## Setup

```bash
npm install
```

## Develop

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Production

```bash
npm run build
npm run start
```

Optional env (see `.env.example`):

- `HOST` — bind address (default from Node adapter)
- `PORT` — port (default `4321`)

## Routes

- `/` — homepage
- `/solutions/mgw` — MGW product page
- `POST /api/demo` — demo lead (`variant`, `name`, `phone`, optional `city` / `email`)
