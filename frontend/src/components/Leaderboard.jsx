/**
 * Displays the top scores across all games.
 */
export default function Leaderboard({ scores }) {
  if (!scores || scores.length === 0) {
    return (
      <div className="leaderboard">
        <h3 className="leaderboard__title">Leaderboard</h3>
        <p className="leaderboard__empty">No scores yet. Be the first!</p>
      </div>
    );
  }

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(2, "0")}`;
  };

  return (
    <div className="leaderboard">
      <h3 className="leaderboard__title">Leaderboard</h3>
      <ol className="leaderboard__list">
        {scores.map((score, index) => (
          <li key={score.id} className="leaderboard__item">
            <span className="leaderboard__rank">{index + 1}.</span>
            <span className="leaderboard__name">{score.playerName}</span>
            <span className="leaderboard__time">{formatTime(score.timeMs)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
