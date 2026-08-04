import { useRef, useState, useCallback } from "react";
import CharacterPopup from "./CharacterPopup";
import Marker from "./Marker";

export default function ImageBoard({
  imageSrc,
  characters,
  foundIds,
  markers = [],
  onGuess,
}) {
  const imageRef = useRef(null);
  const [popup, setPopup] = useState(null);

  const handleImageClick = useCallback((e) => {
    const img = imageRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    setPopup({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      xPercent,
      yPercent,
    });
  }, []);

  const handleSelect = useCallback(
    (characterId) => {
      if (!popup) return;
      onGuess(characterId, popup.xPercent, popup.yPercent);
      setPopup(null);
    },
    [popup, onGuess]
  );

  const handleClose = useCallback(() => {
    setPopup(null);
  }, []);

  return (
    <div className="image-board">
      <div className="image-board__container">
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Crowded beach search scene"
          className="image-board__image"
          onClick={handleImageClick}
          draggable={false}
        />

        {popup && (
          <CharacterPopup
            x={popup.x}
            y={popup.y}
            characters={characters}
            foundIds={foundIds}
            onSelect={handleSelect}
            onClose={handleClose}
          />
        )}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            x={marker.x}
            y={marker.y}
            name={marker.name}
          />
        ))}
      </div>
    </div>
  );
}
