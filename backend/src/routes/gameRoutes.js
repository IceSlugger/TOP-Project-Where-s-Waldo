const { Router } = require("express");
const { startGame, getGame, checkGuess, finishGame } = require("../controllers/gameController");

const router = Router();

router.post("/start", startGame);
router.get("/:token", getGame);
router.post("/:token/check", checkGuess);
router.post("/:token/finish", finishGame);

module.exports = router;
