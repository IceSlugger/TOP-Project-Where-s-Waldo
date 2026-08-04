import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchLeaderboard } from "../services/api";
import Leaderboard from "../components/Leaderboard";

export default function Home() {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaderboard()
      .then((data) => setScores(data.scores))
      .catch(() => setError("Could not load leaderboard."));
  }, []);

  return (
    <div className="home">
      <header className="home__hero">
        <h1 className="home__title">Where&rsquo;s Waldo?</h1>
        <p className="home__subtitle">
          Find Waldo, Odlaw, and Wizard Whitebeard as fast as you can.
        </p>
        <Link to="/game" className="home__start-btn">
          Start New Game
        </Link>
      </header>

      {error && <p className="home__error">{error}</p>}

      <section className="home__leaderboard">
        <Leaderboard scores={scores} />
      </section>
    </div>
  );
}
