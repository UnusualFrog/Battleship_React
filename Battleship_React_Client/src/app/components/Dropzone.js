"use client";
import { useDrop } from "react-dnd";

const Dropzone = ({ row, col, onDrop }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "SHIP",
    drop: (item) => onDrop(item, row, col),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className="w-12 h-12 border border-gray-500 flex items-center justify-center"
      style={{ backgroundColor: isOver ? "lightblue" : "transparent" }}
    >
      {/* Optional: Show coordinates */}
      <span className="text-xs text-gray-400">{row},{col}</span>
    </div>
  );
};

export default Dropzone;
