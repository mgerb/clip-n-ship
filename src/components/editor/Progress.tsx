import { Slider } from "antd";
import React from "react";
import { Util } from "../../services/util";
import "./Progress.scss";

interface IProps {
  currentTime: number;
  duration: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
}

export const Progress = ({
  duration,
  currentTime,
  min,
  max,
  onChange,
}: IProps): JSX.Element => {
  const width = ((max - min) / duration) * 100;
  const left = min * (100 / duration);
  return (
    <div className="progress__container">
      <Slider
        min={0}
        max={duration}
        included={false}
        value={currentTime}
        onChange={onChange}
        tipFormatter={(val) =>
          Util.sliderFormatter((val || 0) - min, { displayMilliseconds: true })
        }
      ></Slider>
      <div
        className="progress__bar-range"
        style={{
          width: width + "%",
          left: left + "%",
        }}
      ></div>
    </div>
  );
};
