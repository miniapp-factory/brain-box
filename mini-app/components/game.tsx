'use client';
import { useState, useEffect } from 'react';
import Grid from './grid';
import Shape from './shape';

const SHAPES = [
  [[0,0]],
  [[0,0],[1,0]],
  [[0,0],[1,0],[2,0]],
  [[0,0],[1,0],[0,1],[1,1]],
  [[0,0],[0,1],[1,1]],
  [[0,0],[1,0],[2,0],[1,1]],
  [[0,0],[1,0],[2,0],[3,0]],
];

function randomShapes() {
  const shapes = [];
  for (let i = 0; i < 3; i++) {
    const cells = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    shapes.push({ id: i, cells });
  }
  return shapes;
}

export default function Game() {
  const [grid, setGrid] = useState(Array(10).fill(null).map(() => Array(10).fill(false)));
  const [shapes, setShapes] = useState(randomShapes());
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const canPlace = (shape: { cells: [number, number][] }, x: number, y: number) => {
    for (const [dx, dy] of shape.cells) {
      const nx = x + dx,
        ny = y + dy;
      if (nx < 0 || nx >= 10 || ny < 0 || ny >= 10 || grid[ny][nx]) return false;
    }
    return true;
  };

  const place = (shape: { cells: [number, number][] }, x: number, y: number) => {
    const newGrid = grid.map((row) => row.slice());
    for (const [dx, dy] of shape.cells) {
      newGrid[y + dy][x + dx] = true;
    }
    setGrid(newGrid);
    setScore((prev) => prev + shape.cells.length);
    clearLines(newGrid);
    setSelected(null);
    setShapes(randomShapes());
  };

  const clearLines = (g: boolean[][]) => {
    let cleared = 0;
    // rows
    for (let y = 0; y < 10; y++) {
      if (g[y].every((v) => v)) {
        g[y] = Array(10).fill(false);
        cleared++;
      }
    }
    // cols
    for (let x = 0; x < 10; x++) {
      let full = true;
      for (let y = 0; y < 10; y++) {
        if (!g[y][x]) {
          full = false;
          break;
        }
      }
      if (full) {
        for (let y = 0; y < 10; y++) g[y][x] = false;
        cleared++;
      }
    }
    if (cleared) {
      setScore((prev) => prev + cleared * 10);
      setCombo((prev) => prev + 5);
    } else {
      setCombo(0);
    }
  };

  const checkGameOver = () => {
    for (const shape of shapes) {
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          if (canPlace(shape, x, y)) return false;
        }
      }
    }
    setGameOver(true);
    return true;
  };

  useEffect(() => {
    if (!gameOver) checkGameOver();
  }, [grid, shapes, gameOver]);

  const reset = () => {
    setGrid(Array(10).fill(null).map(() => Array(10).fill(false)));
    setScore(0);
    setCombo(0);
    setGameOver(false);
    setShapes(randomShapes());
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <span className="text-xl">Score: {score}</span>
        <span className="text-xl">Combo: {combo}</span>
        <button
          onClick={reset}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Reset
        </button>
      </div>
      {gameOver && <div className="text-2xl text-red-600">Game Over</div>}
      <Grid
        grid={grid}
        onCellClick={(x, y) => {
          if (selected !== null) {
            const shape = shapes.find((s) => s.id === selected);
            if (shape && canPlace(shape, x, y)) {
              place(shape, x, y);
            }
          }
        }}
      />
      <div className="flex gap-2">
        {shapes.map((shape) => (
          <Shape
            key={shape.id}
            cells={shape.cells}
            selected={selected === shape.id}
            onClick={() => setSelected(shape.id)}
          />
        ))}
      </div>
    </div>
  );
}
