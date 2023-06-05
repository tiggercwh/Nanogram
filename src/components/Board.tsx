import styles from "./Board.module.css";
import { useEffect, useState } from "react";
import type { Level } from "@prisma/client";

interface BoardProps {
  levelData: Level | null;
  cellSize: number;
}

const Board = (
  { levelData, cellSize }: BoardProps = {
    levelData: null,
    cellSize: 1,
  }
) => {
  const generateAnswerGrid = (grid: (string | null)[][]): boolean[][] => {
    return grid.map((row) => row.map((value) => !!value));
  };

  const generateEmptyGrid = (grid: (string | null)[][]): boolean[][] => {
    return grid.map((row) => Array(row.length).fill(false));
  };

  const [activeGrid, setActiveGrid] = useState<boolean[][]>([]);
  const [answerGrid, setAnswerGrid] = useState<boolean[][]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [pointerFill, setPointerFill] = useState<boolean | null>(null);

  const [clues, setClues] = useState<[number[][], number[][]]>([[], []]);
  const xClues = clues[0];
  const yClues = clues[1];

  const totalWidth = xClues.length + activeGrid.length;
  const totalHeight = yClues.length + activeGrid.length;

  const colorGrid = levelData?.data as (string | null)[][];

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
    const newGrid = generateEmptyGrid(
      (levelData?.data as (string | null)[][]) || []
    );
    const answerGrid = generateAnswerGrid(
      (levelData?.data as (string | null)[][]) || []
    );
    setActiveGrid(newGrid);
    setAnswerGrid(answerGrid);
    setCompleted(false);
    setPointerFill(null);
    setClues(generateClues(answerGrid));
  }, [levelData]);

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

  const validateGrid = () => {
    return JSON.stringify(activeGrid) === JSON.stringify(answerGrid);
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

  const handleMouseOver = (
    event: React.MouseEvent<HTMLTableCellElement>,
    row: number,
    column: number
  ) => {
    if (pointerFill === null) return;
    if (event.buttons === 1) {
      changeCell(row, column, pointerFill);
    }
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLTableCellElement>,
    rowIndex: number,
    columnIndex: number
  ) => {
    // TODO: remove console.log
    console.log(event);

    if (event.buttons === 1) {
      const row = activeGrid[rowIndex];
      if (row === undefined) return;
      const cell = row[columnIndex];
      if (cell === undefined) return;
      setPointerFill(cell === false);
      changeCell(rowIndex, columnIndex, !cell);
    }
  };

  useEffect(() => {
    window.addEventListener(
      "pointerup",
      () => {
        setPointerFill(null);
      },
      { once: true }
    );
  }, []);

  return (
    <>
      <div>
        <table className={`relative bg-yellow-100 ${styles.board}`}>
          <tbody>
            <tr>
              <td></td>
              {yClues?.map((clue, i) => {
                return (
                  <th
                    className={`transition-colors font-semibold text-center align-bottom bg-yellow-300 ${
                      yCluesFullfilled[i] ? "text-green-500" : "text-gray-400"
                    }`}
                    style={{ fontSize: fontSize }}
                    key={`yClue-${i}`}
                  >
                    {clue.map((count, j) => (
                      <div
                        key={`yClue-${i}-${j}`}
                        className="grid place-items-center"
                        style={{
                          width: adjustedCellSize,
                          height: adjustedCellSize,
                        }}
                      >
                        <div>{count}</div>
                      </div>
                    ))}
                  </th>
                );
              })}
            </tr>
            {activeGrid.map((row, i) => {
              return (
                <tr
                  className="relative"
                  key={`row-${i}`}
                  style={{ fontSize: fontSize }}
                >
                  <th
                    className={`transition-colors font-semibold flex flex-row justify-end text-right bg-yellow-300 ${
                      xCluesFullfilled[i] ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {xClues?.[i]?.map((count, j) => (
                      <div
                        key={`xClue-${i}-${j}`}
                        className="grid place-items-center"
                        style={{
                          width: adjustedCellSize,
                          height: adjustedCellSize,
                        }}
                      >
                        <div>{count}</div>
                      </div>
                    ))}
                  </th>
                  {row.map((_, j) => {
                    const row = activeGrid[i];
                    if (row === undefined) return null;
                    const cell = row[j];
                    if (cell === undefined) return null;
                    const cellColor = colorGrid[i]?.[j];
                    return (
                      <td
                        key={`cell-${i}-${j}`}
                        className={`${styles.block} ${
                          !cell || completed ? "" : styles.selected
                        }`}
                        style={{
                          backgroundColor:
                            completed && cellColor ? cellColor : "",
                          width: adjustedCellSize,
                          height: adjustedCellSize,
                        }}
                        onMouseOver={(
                          event: React.MouseEvent<HTMLTableCellElement>
                        ) => handleMouseOver(event, i, j)}
                        onMouseDown={(
                          event: React.MouseEvent<HTMLTableCellElement>
                        ) => handleMouseDown(event, i, j)}
                      ></td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Board;
