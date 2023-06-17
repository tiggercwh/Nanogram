import styles from "./Board.module.css";
import type { Level } from "@prisma/client";
import useBoard from "./useBoard";
import UndoButton from "../UndoButton";
import Toggle from "../Toggle";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

interface BoardProps {
  levelData: Level | null;
  isMobile: boolean;
}

const Board = (
  { levelData, isMobile }: BoardProps = {
    levelData: null,
    isMobile: false,
  }
) => {
  const BoardData = levelData?.data as (string | null)[][];
  const [isCrossing, setIsCrossing] = useState(false);

  const size = levelData?.size as number;
  const scaledSize = Math.floor(size / 10) + 1;

  const cellSize = isMobile ? 0 : scaledSize;

  const {
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
    completed,
    handlePointerOver,
    handlePointerDown,
  } = useBoard(BoardData, cellSize, isCrossing);

  return (
    <>
      <table className={`relative bg-gray-800 ${styles.board}`}>
        <tbody>
          <tr>
            <td>
              <div className="flex flex-col w-full h-full items-center py-4 gap-4 text-xs md:text-2xl">
                <UndoButton
                  history={gridHistory}
                  setState={setCurrentGrid}
                  setHistory={setGridHistory}
                />
                <div className="grid grid-cols-2 grid-flow-col auto-cols-fr w-full">
                  <div
                    className={`flex items-center justify-center col-span-1${
                      isCrossing ? " opacity-25 md:opacity-40" : ""
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-board-squares cursor-pointer md:w-8 md:h-8`}
                      onClick={() => setIsCrossing(false)}
                    />
                  </div>
                  <div className="hidden md:flex items-center justify-center w-full h-full col-span-1">
                    <Toggle checked={isCrossing} setChecked={setIsCrossing} />
                  </div>
                  <div
                    className={`flex w-full h-full items-center justify-center p-1 col-span-1${
                      !isCrossing ? " opacity-25 md:opacity-40" : ""
                    }`}
                  >
                    <RxCross2
                      className="text-red-600 cursor-pointer"
                      onClick={() => setIsCrossing(true)}
                      size={"1.5em"}
                    />
                  </div>
                </div>
              </div>
            </td>
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
                  const isCrossed = crossGrid[i]![j];
                  const cell = currentGrid[i]![j];
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
                    >
                      {isCrossed && (
                        <RxCross2 className="w-full h-full text-red-600" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Board;
