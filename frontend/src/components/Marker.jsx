export default function Marker({ x, y, name }) {
  return (
    <div
      className="marker"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      title={name}
    >
      <div className="marker__dot" />
      <span className="marker__label">{name}</span>
    </div>
  );
}
