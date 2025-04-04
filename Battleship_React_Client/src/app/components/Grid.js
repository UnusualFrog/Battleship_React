'use client';

import Cell from './Cell'

export default function Grid({ rows, cols, onDrop, ships }) {
  // Create grid rows and cells
  const gridRows = [];
  
  for (let row = 0; row < rows; row++) {
    const rowCells = [];
    for (let col = 0; col < cols; col++) {
      rowCells.push(
        <Cell
          key={`${row}-${col}`}
          row={row}
          col={col}
          onDrop={onDrop}
          ships={ships}
        />
      );
    }
    gridRows.push(
      <div key={`row-${row}`} className="flex">
        {rowCells}
      </div>
    );
  }
  
  return (
    <div className="inline-block border-2 border-gray-700 bg-black">
      {gridRows}
    </div>
  );
}