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
