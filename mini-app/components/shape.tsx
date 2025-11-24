'use client';
import React from 'react';

export default function Shape({
  cells,
  selected,
  onClick,
}: {
  cells: [number, number][];
  selected: boolean;
  onClick: () => void;
}) {
  const minX = Math.min(...cells.map((c) => c[0]));
  const minY = Math.min(...cells.map((c) => c[1]));
  const maxX = Math.max(...cells.map((c) => c[0]));
  const maxY = Math.max(...cells.map((c) => c[1]));
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const grid = Array.from({ length: height }, () => Array(width).fill(false));
  cells.forEach(([x, y]) => {
    grid[y - minY][x - minX] = true;
  });

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className={`grid grid-cols-${width} gap-1`}>
        {grid.flat().map((filled, i) => (
          <div
            key={i}
            className={`w-6 h-6 ${filled ? 'bg-indigo-500' : 'bg-gray-200'} border border-gray-400`}
          />
        ))}
      </div>
    </div>
  );
}
