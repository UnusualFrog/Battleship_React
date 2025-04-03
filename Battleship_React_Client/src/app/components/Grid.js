"use client";
import Dropzone from "./Dropzone";

const Grid = ({ rows, cols, onDrop, ships }) => {
  return (
    <div
      className="grid border border-gray-700 relative"
      style={{
        gridTemplateColumns: `repeat(${cols}, 40px)`, // Adjust cell size
        gridTemplateRows: `repeat(${rows}, 40px)`,
        display: "grid",
        gap: "2px",
      }}
    >
      {/* Grid Cells */}
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => (
          <Dropzone key={`${row}-${col}`} row={row} col={col} onDrop={onDrop} />
        ))
      )}

      {/* Render Ships at Their Dropped Positions */}
      {ships.map((ship, index) => (
        <div
          key={index}
          className="absolute bg-blue-600 text-white text-sm flex items-center justify-center rounded"
          style={{
            width: "40px", // Adjust ship width
            height: "40px",
            top: `${ship.row * 42}px`, // Match grid spacing
            left: `${ship.col * 42}px`,
          }}
        >
          {ship.name}
        </div>
      ))}
    </div>
  );
};

export default Grid;
