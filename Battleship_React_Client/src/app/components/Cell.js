import { useDrop } from 'react-dnd';

export default function Cell({ row: gridRow, col: gridCol, onDrop, ships }) {
  const checkShipBounds = (ship) => {

    var startRow = null;
    var endRow = null;
    var startCol = null;
    var endCol = null;

    // Set start and end values of ship
    if (ship.isHorizontal) {
      startRow = ship.row;
      startCol = ship.col - ship.draggedIndex;
      endRow = ship.row;
      endCol = startCol + ship.size - 1;
    } else {
      startRow = ship.row - ship.draggedIndex;
      startCol = ship.col;
      endRow = startRow + ship.size - 1;
      endCol = ship.col;
    }

    // Check if ship is within bounds
    if (ship.isHorizontal) {
      return ship.row == gridRow && gridCol >= startCol && gridCol <= endCol;
    } else {
      return ship.col == gridCol && gridRow >= startRow && gridRow <= endRow;
    }
  }

  // Check if this cell contains a ship
  const ship = ships.find(checkShipBounds);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "SHIP",
    drop: (item) => {
      onDrop(item, gridRow, gridCol);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let cellStyle = "w-10 h-10 border border-gray-600 flex items-center justify-center";
  let backgroundColor = "bg-blue-900"; // Dark blue for water

  // Set color of cell, use ship color if ship exists
  if (isOver) {
    backgroundColor = "bg-blue-400"; // Lighter blue when dragging over
  } else if (ship) {
    backgroundColor = ship.color
  }

  return (
    <div
      ref={dropRef}
      className={`${cellStyle} ${backgroundColor}`}
    >
      <span className="text-xs text-gray-200 opacity-50">{gridRow},{gridCol}</span>
    </div>
  );
};