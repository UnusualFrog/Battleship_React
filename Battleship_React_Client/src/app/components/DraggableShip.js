"use client";
import { useDrag } from "react-dnd";

const DraggableShip = ({ name }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "SHIP",
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className="bg-gray-500 text-white px-4 py-2 rounded cursor-move"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {name}
    </div>
  );
};

export default DraggableShip;
