import * as React from "react";
import { AiOutlineUndo } from "react-icons/ai";
export interface IUndoButtonProps {
  customTwStyle?: string;
  history: any[];
  setHistory: React.Dispatch<React.SetStateAction<any[]>>;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

function UndoButton({
  customTwStyle,
  history,
  setHistory,
  setState,
}: IUndoButtonProps) {
  const disabled = history.length === 0;
  return (
    <div className={`${disabled ? " opacity-40" : ""}`}>
      <button
        disabled={disabled}
        className="p-2 bg-white rounded-md border-2 border-zinc-500"
        onClick={() => {
          if (disabled) return;
          const copiedHistory = [...history];
          const latestHistory = copiedHistory.pop();
          setHistory(copiedHistory);
          setState(latestHistory);
        }}
      >
        <AiOutlineUndo size={"1.5em"} />
      </button>
    </div>
  );
}

export default UndoButton;
