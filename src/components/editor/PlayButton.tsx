import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import { Util } from "../../services/util";

interface IProps {
  currentTime: number;
  min: number;
  max: number;
  playing: boolean;
  onPause: () => void;
  onPlay: () => void;
}

export const PlayButton = ({
  currentTime,
  min,
  max,
  onPause,
  onPlay,
  playing,
}: IProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        type="secondary"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span>{Util.sliderFormatter((currentTime || 0) - (min || 0))}</span>
        <div style={{ margin: "0 1rem" }}>
          {playing ? (
            <PauseCircleOutlined
              className="editor__play-button"
              style={{ fontSize: "2rem" }}
              onClick={() => onPause()}
            />
          ) : (
            <PlayCircleOutlined
              className="editor__play-button"
              style={{ fontSize: "2rem" }}
              onClick={() => onPlay()}
            />
          )}
        </div>
        <span>{Util.sliderFormatter((max || 0) - (min || 0))}</span>
      </Text>
    </div>
  );
};
