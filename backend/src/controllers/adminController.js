const { v4: uuidv4 } = require("uuid");
const prisma = require("../config/prisma");

/**
 * POST /api/admin/start
 * Creates a new game session and returns a unique token the player can use.
 * Requires admin auth.
 */
async function startGame(req, res) {
  try {
    const token = uuidv4();

    const game = await prisma.game.create({
      data: { token },
    });

    const characters = await prisma.character.findMany({
      select: {
        id: true,
        name: true,
        imageName: true,
      },
    });

    res.status(201).json({
      game: {
        id: game.id,
        token: game.token,
        createdAt: game.createdAt,
        finished: game.finished,
      },
      characters,
    });
  } catch (err) {
    console.error("Error starting game:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/admin/games
 * Returns all games (active and finished).
 * Requires admin auth.
 */
async function listGames(req, res) {
  try {
    const games = await prisma.game.findMany({
      include: {
        scores: {
          orderBy: { timeMs: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ games });
  } catch (err) {
    console.error("Error listing games:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { startGame, listGames };
