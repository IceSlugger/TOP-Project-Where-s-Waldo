# Where's Waldo? Photo Tagging Game

A full-stack photo tagging game built for The Odin Project's NodeJS Where's Waldo assignment. It uses React, Express, Prisma, and SQLite.

## Features

- Public anonymous game sessions
- Normalized click coordinates so guesses work across screen sizes
- Backend validation for every guess
- Server-side found-character tracking
- Server-side final timing to prevent fake client scores
- Markers for correctly found characters
- Leaderboard sorted by fastest time
- Dense beach search scene and character portrait targets included in the repo

## Project Structure

```text
where-is-waldo/
|-- backend/
|   |-- prisma/
|   |   |-- schema.prisma
|   |   `-- seed.js
|   `-- src/
|       |-- config/
|       |-- controllers/
|       |-- middleware/
|       |-- routes/
|       |-- app.js
|       `-- server.js
`-- frontend/
    `-- src/
        |-- assets/
        |-- components/
        |-- pages/
        |-- services/
        |-- App.jsx
        `-- main.jsx
```

## Setup

### Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

The backend runs on `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to the backend.

## Render Deployment

Deploy this repo as two separate Render services.

### Backend Web Service

- Service type: `Web Service`
- Root directory: `backend`
- Runtime: `Node`
- Build command: `npm install && npm run prisma:generate`
- Start command: `npm run render:start`
- Health check path: `/api/health`

Environment variables:

```env
DATABASE_URL="file:./dev.db"
ADMIN_TOKEN="change-this-secret"
CORS_ORIGIN="https://your-frontend-name.onrender.com"
```

After it deploys, copy the backend URL, for example `https://your-backend-name.onrender.com`.

### Frontend Static Site

- Service type: `Static Site`
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

Environment variables:

```env
VITE_API_BASE_URL="https://your-backend-name.onrender.com/api"
```

After the frontend URL is created, update the backend `CORS_ORIGIN` value to that exact frontend URL and redeploy the backend.

## Environment Variables

Create `backend/.env` if you want to override the defaults:

```env
DATABASE_URL="file:./dev.db"
ADMIN_TOKEN="admin-secret-token-change-me"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

## API Endpoints

### Game

- `POST /api/game/start` - start a new anonymous game
- `GET /api/game/:token` - get game state, public character names, found IDs, and confirmed markers
- `POST /api/game/:token/check` - validate a selected character at normalized coordinates
- `POST /api/game/:token/finish` - submit a player name after every character is found

### Leaderboard

- `GET /api/leaderboard` - get the fastest scores

### Admin

Protected with `Authorization: Bearer <ADMIN_TOKEN>`.

- `POST /api/admin/start` - create a game session manually
- `GET /api/admin/games` - list games and scores

## Customizing The Scene

The current playable image is `frontend/src/assets/waldo-beach-level1.webp`. To use your own image:

1. Add the new asset in `frontend/src/assets/`.
2. Update the imported image in `frontend/src/pages/Game.jsx`.
3. Edit `backend/prisma/seed.js` so every character's `xMin`, `xMax`, `yMin`, and `yMax` match the image as percentages from `0` to `100`.
4. Re-run `npx prisma db seed`.
