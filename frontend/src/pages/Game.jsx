import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ImageBoard from "../components/ImageBoard";
import Timer from "../components/Timer";
import WinModal from "../components/WinModal";
import CharacterAvatar from "../components/CharacterAvatar";
import { startGame, checkGuess, finishGame } from "../services/api";
import sceneImage from "../assets/waldo-beach-level1.webp";

export default function Game() {
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [foundIds, setFoundIds] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalTime, setFinalTime] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const messageTimerRef = useRef(null);

  const flashMessage = useCallback((msg) => {
    setMessage(msg);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => setMessage(""), 2000);
  }, []);

  useEffect(() => {
    startGame()
      .then((data) => {
        setGame(data.game);
        setCharacters(data.characters);
        setFoundIds(data.foundIds || []);
        setMarkers(data.markers || []);
        setTimerRunning(true);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleGuess = useCallback(
    async (characterId, xPercent, yPercent) => {
      if (!game || gameOver) return;

      try {
        const result = await checkGuess(game.token, characterId, xPercent, yPercent);

        if (!result.hit) {
          flashMessage("Not there. Try again.");
          return;
        }

        setFoundIds((prev) => {
          const next = prev.includes(characterId) ? prev : [...prev, characterId];

          if (result.allFound || next.length >= characters.length) {
            setTimerRunning(false);
            setGameOver(true);
          }

          return next;
        });

        if (result.marker) {
          setMarkers((prev) =>
            prev.some((marker) => marker.id === result.marker.id)
              ? prev
              : [...prev, result.marker]
          );
        }

        flashMessage(
          result.alreadyFound
            ? `${result.characterName} is already marked.`
            : `You found ${result.characterName}!`
        );
      } catch (err) {
        flashMessage("Error checking guess. Please try again.");
      }
    },
    [game, gameOver, characters.length, flashMessage]
  );

  const handleSubmitScore = useCallback(
    async (playerName) => {
      if (!game) return null;
      const data = await finishGame(game.token, playerName);
      setFinalTime(data.score.timeMs);
      return data.score;
    },
    [game]
  );

  const handleTick = useCallback((ms) => {
    setFinalTime(ms);
  }, []);

  const handleViewResults = useCallback(() => {
    navigate("/result");
  }, [navigate]);

  if (loading) {
    return (
      <div className="game">
        <p className="game__loading">Starting game&hellip;</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game">
        <p className="game__error">{error}</p>
      </div>
    );
  }

  return (
    <div className="game">
      <header className="game__header">
        <Timer running={timerRunning} onTick={handleTick} />
        <div className="game__status">
          {characters.map((char) => (
            <div
              key={char.id}
              className={`game__target-card ${
                foundIds.includes(char.id) ? "game__target-card--found" : ""
              }`}
            >
              <CharacterAvatar name={char.name} found={foundIds.includes(char.id)} />
              <span className="game__target-copy">
                <strong>{char.name}</strong>
                <small>{foundIds.includes(char.id) ? "Found" : "Missing"}</small>
              </span>
            </div>
          ))}
        </div>
      </header>

      {message && <div className="game__message">{message}</div>}

      <ImageBoard
        imageSrc={sceneImage}
        characters={characters}
        foundIds={foundIds}
        markers={markers}
        onGuess={handleGuess}
      />

      {gameOver && (
        <WinModal
          timeMs={finalTime}
          onSubmit={handleSubmitScore}
          onClose={handleViewResults}
        />
      )}
    </div>
  );
}
