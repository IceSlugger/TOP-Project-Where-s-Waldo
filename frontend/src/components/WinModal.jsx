import { useState } from "react";

export default function WinModal({ timeMs, onSubmit, onClose }) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const displayedMs = submittedScore?.timeMs ?? timeMs;
  const minutes = Math.floor(displayedMs / 60000);
  const seconds = Math.floor((displayedMs % 60000) / 1000);
  const millis = Math.floor((displayedMs % 1000) / 10);
  const displayTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(2, "0")}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }

    if (trimmed.length > 30) {
      setError("Name must be 30 characters or fewer.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const score = await onSubmit(trimmed);
      setSubmittedScore(score);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Could not submit your score.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="win-modal__overlay" onClick={onClose}>
      <div className="win-modal" onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <>
            <h2 className="win-modal__title">You found everyone!</h2>
            <p className="win-modal__time">
              Your time: <strong>{displayTime}</strong>
            </p>
            <form onSubmit={handleSubmit} className="win-modal__form">
              <label htmlFor="player-name">Enter your name for the leaderboard:</label>
              <input
                id="player-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                autoFocus
                placeholder="Your name"
              />
              {error && <p className="win-modal__error">{error}</p>}
              <button type="submit" className="win-modal__btn" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Score"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="win-modal__title">Score submitted!</h2>
            <p className="win-modal__time">
              {name} - <strong>{displayTime}</strong>
            </p>
            <button className="win-modal__btn" onClick={onClose}>
              View Leaderboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
