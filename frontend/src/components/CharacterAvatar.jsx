import waldoPortrait from "../assets/characters/waldo.png";
import wizardPortrait from "../assets/characters/wizard-whitebeard.png";
import odlawPortrait from "../assets/characters/odlaw.png";

const avatarClassByName = {
  Waldo: waldoPortrait,
  "Wizard Whitebeard": wizardPortrait,
  Odlaw: odlawPortrait,
};

export default function CharacterAvatar({ name, found = false }) {
  const portrait = avatarClassByName[name] || waldoPortrait;

  return (
    <img
      className={`character-avatar ${found ? "character-avatar--found" : ""}`}
      src={portrait}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}
