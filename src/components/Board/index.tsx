import styles from "./Board.module.css";
import type { Level } from "@prisma/client";
import useBoard from "./useBoard";
import UndoButton from "../UndoButton";

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
  const BoardData = levelData?.data as (string | null)[][];

  //input: levelData?.data
  //xCluesFullfilled, yCluesFullfilled, currentGrid, pointerFill, completed, handlePointerOver, handlePointerDown
  const {
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
    completed,
    handlePointerOver,
    handlePointerDown,
  } = useBoard(BoardData, cellSize);

  return (
    <>
      <div className="grid grid-cols-10">
        <table className={`col-span-9 relative bg-yellow-100 ${styles.board}`}>
          <tbody>
            <tr>
              <td></td>
              {yClues?.map((clue, i) => {
                return (
                  <th
                    className={`transition-colors font-semibold text-center align-bottom bg-yellow-300 ${
                      yCluesFullfilled[i] ? "text-sky-500" : "text-gray-400"
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
            {currentGrid.map((row, i) => {
              return (
                <tr
                  className="relative"
                  key={`row-${i}`}
                  style={{ fontSize: fontSize }}
                >
                  <th
                    className={`transition-colors font-semibold flex flex-row justify-end text-right bg-yellow-300 ${
                      xCluesFullfilled[i] ? "text-sky-500" : "text-gray-400"
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
                    const row = currentGrid[i];
                    if (row === undefined) return null;
                    const cell = row[j];
                    if (cell === undefined) return null;
                    const cellColor = BoardData[i]?.[j];
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
                        onPointerOver={(
                          event: React.PointerEvent<HTMLTableCellElement>
                        ) => handlePointerOver(event, i, j)}
                        onPointerDown={(
                          event: React.PointerEvent<HTMLTableCellElement>
                        ) => handlePointerDown(event, i, j)}
                      ></td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="col-span-1">
          <UndoButton
            history={gridHistory}
            setState={setCurrentGrid}
            setHistory={setGridHistory}
          />
        </div>
      </div>
    </>
  );
};

export default Board;
