
'use client';
import { useState, useEffect } from 'react';

export default function ShipControls({ 
  gridRows, 
  gridCols, 
  onGridRowsChange, 
  onGridColsChange 
}) {
  // Styling classes
  const styles = {
    inputContainer: "flex flex-wrap gap-4 justify-center w-full pb-6",
    form: "flex flex-col items-center",
    label: "block mb-2 text-sm font-medium text-gray-300",
    input: "bg-gray-800 border border-gray-600 text-white text-sm rounded-lg p-2.5 w-20",
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.form}>
        <label htmlFor="rows-input" className={styles.label}>Grid Rows:</label>
        <input
          type="number"
          id="rows-input"
          placeholder="10"
          value={gridRows}
          min="5"
          max="15"
          required
          onChange={(e) => {
            onGridRowsChange(Number(e.target.value));
          }}
          className={styles.input}
        />
      </div>
      <div className={styles.form}>
        <label htmlFor="cols-input" className={styles.label}>Grid Cols:</label>
        <input
          type="number"
          id="cols-input"
          placeholder="10"
          value={gridCols}
          min="5"
          max="15"
          required
          onChange={(e) => {
            onGridColsChange(Number(e.target.value));
          }}
          className={styles.input}
        />
      </div>
    </div>
  );
}