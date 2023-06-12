import { useState, useEffect } from "react";

const useBoard = (BoardData: (string | null)[][], cellSize: number) => {
  const [currentGrid, setCurrentGrid] = useState<boolean[][]>([]);
  const [gridHistory, setGridHistory] = useState<boolean[][]>([]);
  const [answerGrid, setAnswerGrid] = useState<boolean[][]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [pointerFill, setPointerFill] = useState<boolean | null>(null);

  const [clues, setClues] = useState<[number[][], number[][]]>([[], []]);
  const [xClues, yClues] = clues;

  const totalWidth = xClues.length + currentGrid.length;
  const totalHeight = yClues.length + currentGrid.length;

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
    setCurrentGrid(newGrid);
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
      currentGrid.map((row) => row.map((cell) => !!cell))
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

  const changeCell = (
    grid: boolean[][],
    row: number,
    column: number,
    state: boolean
  ) => {
    if (completed) return; // No changes allowed after completion

    // Update the active grid
    grid[row]![column]! = state;
    setCurrentGrid(grid);

    // Update the clues
    checkClues();

    // Check if the puzzle is completed
    if (validateGrid()) {
      setCompleted(true);
    }
  };

  const validateGrid = () => {
    return JSON.stringify(currentGrid) === JSON.stringify(answerGrid);
  };

  const handlePointerOver = (
    event: React.PointerEvent<HTMLTableCellElement>,
    row: number,
    column: number
  ) => {
    if (pointerFill === null) return;
    if (event.buttons === 1) {
      changeCell(currentGrid, row, column, pointerFill);
    }
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLTableCellElement>,
    rowIndex: number,
    columnIndex: number
  ) => {
    if (event.buttons === 1) {
      setGridHistory((history) => [
        ...history,
        JSON.parse(JSON.stringify(currentGrid)),
      ]);
      const grid = JSON.parse(JSON.stringify(currentGrid));
      const row = grid[rowIndex];
      if (row === undefined) return;
      const cell = row[columnIndex];
      if (cell === undefined) return;
      setPointerFill(cell === false);
      changeCell(grid, rowIndex, columnIndex, !cell);
    }
  };

  return {
    adjustedCellSize,
    fontSize,
    xClues,
    yClues,
    xCluesFullfilled,
    yCluesFullfilled,
    currentGrid,
    setCurrentGrid,
    gridHistory,
    setGridHistory,
    pointerFill,
    completed,
    handlePointerOver,
    handlePointerDown,
  };
};

export default useBoard;
