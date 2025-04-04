import { useDrop } from 'react-dnd';

export default function Cell({ row, col, onDrop, ships }) {
  // Check if this cell contains a ship
  const ship = ships.find(ship => ship.row === row && ship.col === col);
  
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "SHIP",
    drop: (item) => {
      onDrop(item, row, col);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  let cellStyle = "w-10 h-10 border border-gray-600 flex items-center justify-center";
  let backgroundColor = "bg-blue-900"; // Dark blue for water
  
  if (isOver) {
    backgroundColor = "bg-blue-400"; // Lighter blue when dragging over
  } else if (ship) {
    backgroundColor = ship.color // Gray for ship
  }
  
  return (
    <div
      ref={dropRef}
      className={`${cellStyle} ${backgroundColor}`}
    >
      <span className="text-xs text-gray-200 opacity-50">{row},{col}</span>
    </div>
  );
};