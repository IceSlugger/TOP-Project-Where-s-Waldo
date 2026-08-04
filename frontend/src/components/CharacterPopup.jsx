import { useEffect, useRef } from "react";
import CharacterAvatar from "./CharacterAvatar";

/**
 * A dropdown popup that appears at the click location.
 * Lists characters the player hasn't found yet.
 */
export default function CharacterPopup({
  x,
  y,
  characters,
  foundIds,
  onSelect,
  onClose,
}) {
  const popupRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    }

    // Delay adding the listener so the current click doesn't close it
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const remaining = characters.filter((c) => !foundIds.includes(c.id));

  if (remaining.length === 0) {
    return null;
  }

  return (
    <div
      ref={popupRef}
      className="character-popup"
      style={{
        left: x,
        top: y,
      }}
    >
      <ul className="character-popup__list">
        {remaining.map((char) => (
          <li key={char.id}>
            <button
              className="character-popup__btn"
              onClick={() => onSelect(char.id)}
            >
              <CharacterAvatar name={char.name} />
              <span>{char.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
