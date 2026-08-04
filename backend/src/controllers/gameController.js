const { v4: uuidv4 } = require("uuid");
const prisma = require("../config/prisma");

function serializeCharacter(character) {
  return {
    id: character.id,
    name: character.name,
    imageName: character.imageName,
  };
}

function serializeMarker(character) {
  return {
    id: character.id,
    name: character.name,
    x: (character.xMin + character.xMax) / 2,
    y: (character.yMin + character.yMax) / 2,
  };
}

function isValidCoordinate(value) {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

async function startGame(req, res) {
  try {
    const token = uuidv4();

    const [game, characters] = await prisma.$transaction([
      prisma.game.create({ data: { token } }),
      prisma.character.findMany({ orderBy: { id: "asc" } }),
    ]);

    res.status(201).json({
      game: {
        id: game.id,
        token: game.token,
        createdAt: game.createdAt,
        finished: game.finished,
      },
      characters: characters.map(serializeCharacter),
      foundIds: [],
      markers: [],
    });
  } catch (err) {
    console.error("Error starting game:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getGame(req, res) {
  try {
    const { token } = req.params;

    const game = await prisma.game.findUnique({
      where: { token },
      include: {
        foundCharacters: {
          include: { character: true },
          orderBy: { foundAt: "asc" },
        },
      },
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const characters = await prisma.character.findMany({ orderBy: { id: "asc" } });

    res.json({
      game: {
        id: game.id,
        token: game.token,
        createdAt: game.createdAt,
        finished: game.finished,
      },
      characters: characters.map(serializeCharacter),
      foundIds: game.foundCharacters.map((found) => found.characterId),
      markers: game.foundCharacters.map((found) => serializeMarker(found.character)),
    });
  } catch (err) {
    console.error("Error fetching game:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function checkGuess(req, res) {
  try {
    const { token } = req.params;
    const characterId = Number(req.body.characterId);
    const x = Number(req.body.x);
    const y = Number(req.body.y);

    if (!Number.isInteger(characterId) || !isValidCoordinate(x) || !isValidCoordinate(y)) {
      return res.status(400).json({ error: "characterId, x, and y are required" });
    }

    const game = await prisma.game.findUnique({ where: { token } });
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    if (game.finished) {
      return res.status(400).json({ error: "This game has already finished" });
    }

    const character = await prisma.character.findUnique({ where: { id: characterId } });
    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }

    const alreadyFound = await prisma.foundCharacter.findUnique({
      where: {
        gameId_characterId: {
          gameId: game.id,
          characterId,
        },
      },
    });

    if (alreadyFound) {
      return res.json({
        hit: true,
        alreadyFound: true,
        characterName: character.name,
        marker: serializeMarker(character),
      });
    }

    const hit =
      x >= character.xMin &&
      x <= character.xMax &&
      y >= character.yMin &&
      y <= character.yMax;

    if (!hit) {
      return res.json({
        hit: false,
        characterName: null,
      });
    }

    await prisma.foundCharacter.create({
      data: {
        gameId: game.id,
        characterId,
      },
    });

    const [foundCount, totalCount] = await Promise.all([
      prisma.foundCharacter.count({ where: { gameId: game.id } }),
      prisma.character.count(),
    ]);

    res.json({
      hit,
      alreadyFound: false,
      characterName: character.name,
      marker: serializeMarker(character),
      allFound: foundCount === totalCount,
    });
  } catch (err) {
    console.error("Error checking guess:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function finishGame(req, res) {
  try {
    const { token } = req.params;
    const playerName = String(req.body.playerName || "").trim();

    if (!playerName) {
      return res.status(400).json({ error: "Missing required field: playerName" });
    }

    if (playerName.length > 30) {
      return res.status(400).json({ error: "Player name must be 30 characters or fewer" });
    }

    const game = await prisma.game.findUnique({
      where: { token },
      include: { foundCharacters: true },
    });
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    if (game.finished) {
      return res.status(400).json({ error: "This game has already finished" });
    }

    const totalCount = await prisma.character.count();
    if (game.foundCharacters.length !== totalCount) {
      return res.status(400).json({ error: "Find every character before submitting a score" });
    }

    const finishedAt = new Date();
    const timeMs = finishedAt.getTime() - game.createdAt.getTime();

    const score = await prisma.$transaction(async (tx) => {
      const createdScore = await tx.score.create({
        data: {
          gameId: game.id,
          playerName,
          timeMs,
        },
      });

      await tx.game.update({
        where: { id: game.id },
        data: { finished: true, finishedAt },
      });

      return createdScore;
    });

    res.status(201).json({ score });
  } catch (err) {
    console.error("Error finishing game:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { startGame, getGame, checkGuess, finishGame };
