const API_BASE = "/api";

/**
 * Start a public anonymous game session.
 */
export async function startGame() {
  const res = await fetch(`${API_BASE}/game/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to start game");
  }
  return res.json();
}

/**
 * Fetch game info and character list (without coordinates).
 */
export async function fetchGame(token) {
  const res = await fetch(`${API_BASE}/game/${token}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch game");
  }
  return res.json();
}

/**
 * Check if a click hit a specific character.
 */
export async function checkGuess(token, characterId, x, y) {
  const res = await fetch(`${API_BASE}/game/${token}/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ characterId, x, y }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to check guess");
  }
  return res.json();
}

/**
 * Submit the player's score when they find all characters.
 */
export async function finishGame(token, playerName) {
  const res = await fetch(`${API_BASE}/game/${token}/finish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit score");
  }
  return res.json();
}

/**
 * Fetch the leaderboard.
 */
export async function fetchLeaderboard() {
  const res = await fetch(`${API_BASE}/leaderboard`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch leaderboard");
  }
  return res.json();
}
