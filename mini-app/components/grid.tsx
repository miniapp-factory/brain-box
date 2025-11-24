'use client';
import React from 'react';

export default function Grid({
  grid,
  onCellClick,
}: {
  grid: boolean[][];
  onCellClick: (x: number, y: number) => void;
}) {
  return (
    <div className="grid grid-cols-10 gap-1">
      {grid.flatMap((row, y) =>
        row.map((filled, x) => (
          <div
            key={`${x}-${y}`}
            onClick={() => onCellClick(x, y)}
            className={`w-8 h-8 ${filled ? 'bg-indigo-500' : 'bg-gray-200'} border border-gray-400`}
          />
        ))
      )}
    </div>
  );
}
