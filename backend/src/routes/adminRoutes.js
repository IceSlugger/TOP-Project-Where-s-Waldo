const { Router } = require("express");
const { adminAuth } = require("../middleware/auth");
const { startGame, listGames } = require("../controllers/adminController");

const router = Router();

// All admin routes require authentication
router.use(adminAuth);

router.post("/start", startGame);
router.get("/games", listGames);

module.exports = router;
