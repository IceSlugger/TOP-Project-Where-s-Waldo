import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchLeaderboard } from "../services/api";
import Leaderboard from "../components/Leaderboard";

export default function Result() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaderboard()
      .then((data) => {
        setScores(data.scores);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="result">
      <h2 className="result__title">Leaderboard</h2>

      {loading && <p className="result__loading">Loading scores&hellip;</p>}
      {error && <p className="result__error">{error}</p>}

      {!loading && !error && <Leaderboard scores={scores} />}

      <div className="result__actions">
        <Link to="/game" className="result__btn result__btn--primary">
          Play Again
        </Link>
        <Link to="/" className="result__btn result__btn--secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
