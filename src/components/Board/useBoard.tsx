import { useState, useEffect } from "react";

const useBoard = (
  BoardData: (string | null)[][],
  cellSize: number,
  isCrossing: boolean
) => {
  const [currentGrid, setCurrentGrid] = useState<boolean[][]>([]);
  const [gridHistory, setGridHistory] = useState<boolean[][]>([]);
  const [answerGrid, setAnswerGrid] = useState<boolean[][]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [pointerFill, setPointerFill] = useState<boolean | null>(null);

  const [crossGrid, setCrossGrid] = useState<boolean[][]>([]);

  const [clues, setClues] = useState<[number[][], number[][]]>([[], []]);
  const [xClues, yClues] = clues;
  const [xCluesFullfilled, setXCluesFullfilled] = useState([] as boolean[]);
  const [yCluesFullfilled, setYCluesFullfilled] = useState([] as boolean[]);

  const totalWidth = xClues.length + currentGrid.length;
  const totalHeight = yClues.length + currentGrid.length;

  const sizes = [
    {
      cell: 600,
    },
    {
      cell: 900,
    },
    {
      cell: 1200,
    },
  ];

  console.log(sizes[cellSize]);

  const adjustedCellSize =
    sizes[cellSize]!.cell / Math.max(totalWidth, totalHeight);

  const fontSize = adjustedCellSize / 2.5;

  /*
  Effects
  */

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
      const newgrid = JSON.parse(JSON.stringify(grid)) as boolean[][];
      return newgrid.map((row) => new Array(row.length).fill(false));
    };

    const newGrid = generateEmptyGrid(BoardData);
    const answerGrid = generateAnswerGrid(BoardData);
    const crossGrid = generateEmptyGrid(BoardData);

    setCrossGrid(crossGrid);
    setCurrentGrid(newGrid);
    setAnswerGrid(answerGrid);
    setCompleted(false);
    setPointerFill(null);
    setClues(generateClues(answerGrid));
  }, [BoardData]);

  useEffect(() => {
    if (currentGrid.length === 0) return;
    // Update the clues
    checkClues();

    // Check if the puzzle is completed
    if (validateGrid()) {
      setCompleted(true);
    }
  }, [currentGrid]);

  /*
  Helpers
  */

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
    for (let j = 0; j < grid[0]!.length; j++) {
      yClues[j] = clueFromArray(grid.map((row) => row[j]) as boolean[]);
    }
    return [xClues, yClues];
  };

  const checkClues = () => {
    // We can optimize this by only checking the clues that are affected by the last change
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
    const setGrid = !isCrossing ? setCurrentGrid : setCrossGrid;
    setGrid(grid);
  };

  const changeGrid = (
    rowIndex: number,
    columnIndex: number,
    isCurrentGrid: boolean
  ) => {
    const toChangeGrid = isCurrentGrid ? currentGrid : crossGrid;
    const referenceGrid = isCurrentGrid ? crossGrid : currentGrid;

    if (referenceGrid[rowIndex]![columnIndex]) return;
    const grid = JSON.parse(JSON.stringify(toChangeGrid));
    if (isCurrentGrid)
      setGridHistory((history) => [
        ...history,
        JSON.parse(JSON.stringify(toChangeGrid)),
      ]);
    const cell = grid[rowIndex][columnIndex];
    if (cell === undefined) return;
    setPointerFill(!cell);
    changeCell(grid, rowIndex, columnIndex, !cell);
  };

  const validateGrid = () => {
    return JSON.stringify(currentGrid) === JSON.stringify(answerGrid);
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLTableCellElement>,
    rowIndex: number,
    columnIndex: number
  ) => {
    if (event.buttons === 1) {
      changeGrid(rowIndex, columnIndex, !isCrossing);
    }
  };

  const handlePointerOver = (
    event: React.PointerEvent<HTMLTableCellElement>,
    row: number,
    column: number
  ) => {
    if (pointerFill === null) return;
    if (event.buttons === 1) {
      const toChangeGrid = isCrossing ? crossGrid : currentGrid;
      const referenceGrid = isCrossing ? currentGrid : crossGrid;
      if (referenceGrid[row]![column]) return;
      changeCell(
        JSON.parse(JSON.stringify(toChangeGrid)),
        row,
        column,
        pointerFill
      );
    }
  };

  return {
    adjustedCellSize,
    crossGrid,
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
