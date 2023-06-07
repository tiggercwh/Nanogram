import { useState } from "react";
import styles from "./DoubleRangeSlider.module.css";

interface DoubleRangeSliderProps {
  min: number;
  max: number;
  onChange: (lowVal: number, highVal: number) => void;
}

const DoubleRangeSlider = ({ min, max, onChange }: BoardProps) => {
  const [lowVal, setLowVal] = useState(min);
  const [highVal, setHighVal] = useState(max);

  return (
    <div className="w-full h-full relative">
      <input
        type="range"
        className={`w-full absolute top-1/2 -translate-y-1/2 z-10 ${styles.slider}`}
        min={min}
        max={max}
        value={lowVal}
        onChange={(event) => {
          const newVal = Number(event.target.value);
          if (newVal >= highVal) return;
          setLowVal(newVal);
          onChange(newVal, highVal);
        }}
      />
      <input
        type="range"
        className={`w-full absolute top-1/2 -translate-y-1/2 z-10 ${styles.slider}`}
        min={min}
        max={max}
        value={highVal}
        onChange={(event) => {
          const newVal = Number(event.target.value);
          if (newVal <= lowVal) return;
          setHighVal(newVal);
          onChange(lowVal, newVal);
        }}
      />
      <div className="w-full h-full px-2 z-0">
        <div className="w-full h-full bg-cyan-400 relative rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500"
            style={{
              left: `${((lowVal - min) / (max - min)) * 100}%`,
              width: `${((highVal - lowVal) / (max - min)) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;
