import { useState, useEffect, useRef } from "react";

export default function Timer({ running, onTick }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;

    startRef.current = Date.now() - elapsed;

    function tick() {
      const ms = Date.now() - startRef.current;
      setElapsed(ms);
      onTick?.(ms);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="timer">
      <span className="timer__icon">Time</span>
      <span className="timer__display">{display}</span>
    </div>
  );
}
