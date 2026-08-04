const prisma = require("../config/prisma");

/**
 * GET /api/leaderboard
 * Returns the top scores across all finished games, ordered by fastest time.
 */
async function getLeaderboard(req, res) {
  try {
    const scores = await prisma.score.findMany({
      orderBy: { timeMs: "asc" },
      take: 50,
      select: {
        id: true,
        playerName: true,
        timeMs: true,
        createdAt: true,
      },
    });

    res.json({ scores });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getLeaderboard };
