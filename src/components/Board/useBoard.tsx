import { useState, useEffect } from "react";

const useBoard = (BoardData: (string | null)[][], cellSize: number) => {
  const [activeGrid, setActiveGrid] = useState<boolean[][]>([]);
  const [answerGrid, setAnswerGrid] = useState<boolean[][]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [pointerFill, setPointerFill] = useState<boolean | null>(null);

  const [clues, setClues] = useState<[number[][], number[][]]>([[], []]);
  const xClues = clues[0];
  const yClues = clues[1];

  const totalWidth = xClues.length + activeGrid.length;
  const totalHeight = yClues.length + activeGrid.length;

  const sizes = [
    {
      cell: 400,
    },
    {
      cell: 700,
    },
    {
      cell: 900,
    },
  ];
  const adjustedCellSize =
    sizes[cellSize]!.cell / Math.max(totalWidth, totalHeight);

  const fontSize = adjustedCellSize / 2.5;

  useEffect(() => {
    window.addEventListener(
      "pointerup",
      () => {
        setPointerFill(null);
      },
      { once: true }
    );
  }, []);

  useEffect(() => {
    const generateAnswerGrid = (grid: (string | null)[][]): boolean[][] => {
      return grid.map((row) => row.map((value) => !!value));
    };

    const generateEmptyGrid = (grid: (string | null)[][]): boolean[][] => {
      return grid.map((row) => Array(row.length).fill(false));
    };

    console.log({ BoardData });
    const newGrid = generateEmptyGrid(BoardData);
    const answerGrid = generateAnswerGrid(BoardData);
    setActiveGrid(newGrid);
    setAnswerGrid(answerGrid);
    setCompleted(false);
    setPointerFill(null);
    setClues(generateClues(answerGrid));
  }, [BoardData]);

  useEffect(() => {
    checkClues();
  }, [clues]);

  const clueFromArray = (array: boolean[]) => {
    const clue = [];
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        count++;
      } else {
        if (count > 0) {
          clue.push(count);
          count = 0;
        }
      }
    }
    if (count > 0) {
      clue.push(count);
    }
    if (clue.length === 0) {
      clue.push(0);
    }
    return clue;
  };

  const generateClues = (grid: boolean[][]): [number[][], number[][]] => {
    if (grid.length === 0) {
      return [[], []];
    }
    const xClues = [];
    for (let i = 0; i < grid.length; i++) {
      xClues[i] = clueFromArray(grid[i] as boolean[]);
    }
    const yClues = [];
    for (let i = 0; i < grid[0]!.length; i++) {
      yClues[i] = clueFromArray(grid.map((row) => row[i]) as boolean[]);
    }
    return [xClues, yClues];
  };

  const [xCluesFullfilled, setXCluesFullfilled] = useState([] as boolean[]);
  const [yCluesFullfilled, setYCluesFullfilled] = useState([] as boolean[]);

  const checkClues = () => {
    const [newXClues, newYClues] = generateClues(
      activeGrid.map((row) => row.map((cell) => !!cell))
    );
    const newXCluesFullfilled = newXClues!.map(
      (clues, i) =>
        clues.length === (xClues as any)[i].length &&
        clues.every((clue, j) => clue === (xClues as any)[i][j])
    );
    const newYCluesFullfilled = newYClues!.map(
      (clues, i) =>
        clues.length === (yClues as any)[i].length &&
        clues.every((clue, j) => clue === (yClues as any)[i][j])
    );
    setXCluesFullfilled(newXCluesFullfilled);
    setYCluesFullfilled(newYCluesFullfilled);
  };

  const changeCell = (row: number, column: number, state: boolean) => {
    if (completed) return; // No changes allowed after completion

    // Update the active grid
    const newGrid = [...activeGrid];
    newGrid[row]![column]! = state;
    setActiveGrid(newGrid);

    // Update the clues
    checkClues();

    // Check if the puzzle is completed
    if (validateGrid()) {
      setCompleted(true);
    }
  };

  const validateGrid = () => {
    return JSON.stringify(activeGrid) === JSON.stringify(answerGrid);
  };

  const handlePointerOver = (
    event: React.PointerEvent<HTMLTableCellElement>,
    row: number,
    column: number
  ) => {
    if (pointerFill === null) return;
    if (event.buttons === 1) {
      changeCell(row, column, pointerFill);
    }
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLTableCellElement>,
    rowIndex: number,
    columnIndex: number
  ) => {
    if (event.buttons === 1) {
      const row = activeGrid[rowIndex];
      if (row === undefined) return;
      const cell = row[columnIndex];
      if (cell === undefined) return;
      setPointerFill(cell === false);
      changeCell(rowIndex, columnIndex, !cell);
    }
  };

  return {
    adjustedCellSize,
    fontSize,
    xClues,
    yClues,
    xCluesFullfilled,
    yCluesFullfilled,
    activeGrid,
    pointerFill,
    completed,
    handlePointerOver,
    handlePointerDown,
  };
};

export default useBoard;
