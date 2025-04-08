'use client';
import { useState } from 'react';
import { useDrag } from 'react-dnd';

// Define ship sizes
const SHIP_SIZES = {
  Destroyer: 2,
  Submarine: 3,
  Cruiser: 3,
  Battleship: 4,
  Carrier: 5
};

// Define ship colors
const SHIP_COLORS = {
  Destroyer: 'bg-green-600',
  Submarine: 'bg-yellow-600',
  Cruiser: 'bg-orange-600',
  Battleship: 'bg-red-600',
  Carrier: 'bg-purple-600'
};

export default function DraggableShip({
  name,
  isHorizontal,
  onOrientationChange
}) {
  const toggleOrientation = () => {
    onOrientationChange(!isHorizontal);
  };
  const [draggedIndex, setDraggedIndex] = useState(0);
  const size = SHIP_SIZES[name];
  const color = SHIP_COLORS[name];

  // Define dragging behavior
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "SHIP",
    item: { name, size, isHorizontal, color, draggedIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    })
  }), [name, size, isHorizontal, color, draggedIndex]);

  // Create ship cells based on size of grid
  const shipCells = [];
  for (let i = 0; i < size; i++) {
    shipCells.push(
      <div
        key={i}
        className={`w-10 h-10 border border-gray-700 ${color}`}
        onMouseDown={() => setDraggedIndex(i)} // Used to track which cell of the ship was grabbed
      ></div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-4">
      <div
        ref={dragRef}
        className={`flex cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'} ${isHorizontal ? 'flex-row' : 'flex-col'}`}
      >
        {shipCells}
      </div>
      <div className="mt-2 flex flex-col items-center">
        <button
          onClick={() => toggleOrientation()}
          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
        >
          Rotate
        </button>
        <span className="text-sm mt-1 text-white">{name}</span>
      </div>
    </div>
  );
}