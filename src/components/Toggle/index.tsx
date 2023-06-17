import * as React from "react";

export interface IToggleProps {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

function Toggle({ checked, setChecked }: IToggleProps) {
  return (
    <>
      <label className="w-min relative inline-flex flex-col items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={() => setChecked((prevChecked) => !prevChecked)}
        />
        <div
          className="w-14 h-7 bg-gray-200 rounded-full peer dark:bg-gray-700 dark:border-gray-600
        after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white
        after:rounded-full after:h-6 after:w-6 after:transition-all after:border-gray-300 after:border
        peer-checked:bg-yellow-400 peer-checked:after:translate-x-full peer-checked:after:bg-yellow-100"
        ></div>
      </label>
    </>
  );
}

export default Toggle;
