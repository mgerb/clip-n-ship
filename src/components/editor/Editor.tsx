import { Button, Slider } from "antd";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import React from "react";
import { FFMPEG } from "../../services/ffmpeg";
import { Util } from "../../services/util";
import "./Editor.scss";
import { PlayButton } from "./PlayButton";
import { Progress } from "./Progress";

interface IProps {
  filePath: string;
}

interface IState {
  currentTime?: number;
  duration?: number;
  min?: number;
  max?: number;
  playing: boolean;
}

export class Editor extends React.Component<IProps, IState> {
  private videoNode?: Plyr;

  constructor(props: IProps) {
    super(props);
    this.state = {
      playing: false,
    };
  }

  componentWillUnmount() {
    this.videoNode?.destroy();
  }

  play = () => {
    this.videoNode?.play();
    this.setState({ playing: true });
  };

  pause = () => {
    this.videoNode?.pause();
    this.setState({ playing: false });
  };

  setPlayerCurrentTime(val: number) {
    this.videoNode!.currentTime = val / 1000;
  }

  onLoadStart = () => {
    const controls: any = ["volume", "mute", "duration"];
    this.videoNode = new Plyr(".video", {
      controls,
      keyboard: { focused: true, global: true },
    });

    this.videoNode.on("timeupdate", (update) => {
      let newTime = this.videoNode!.currentTime * 1000;
      if (this.state.max && this.state.min && newTime > this.state.max) {
        newTime = this.state.min;
        this.videoNode!.currentTime = newTime / 1000;
      }
      this.setState({
        currentTime: newTime,
      });
    });
    this.videoNode?.on("pause", () => {
      this.setState({ playing: false });
    });
    this.videoNode?.on("play", () => {
      this.setState({ playing: true });
    });
    this.videoNode?.on("ready", () => {
      this.videoNode?.pause();
      this.setState({ playing: false });
    });
    this.videoNode?.on("canplay", () => {
      if (!this.state.duration) {
        this.setState({
          duration: this.videoNode!.duration * 1000,
          min: 0,
          max: this.videoNode!.duration * 1000,
        });
      }
    });
  };

  sliderChange = (val: number) => {
    if (this.videoNode && val >= this.state.min! && val <= this.state.max!) {
      this.setPlayerCurrentTime(val);
      this.setState({
        currentTime: val,
      });
    }
  };

  rangeSliderChange = ([min, max]: number[]) => {
    if (
      (this.state.currentTime && this.state.currentTime < min) ||
      this.state.min !== min
    ) {
      this.setPlayerCurrentTime(min);
      this.setState({ currentTime: min });
    }

    if (
      (this.state.currentTime && this.state.currentTime > max) ||
      this.state.max !== max
    ) {
      this.setPlayerCurrentTime(max);
      this.setState({ currentTime: max });
    }
    this.setState({ min, max });
  };

  onSave = () => {
    FFMPEG.save(this.props.filePath, {
      min: this.state.min || 0,
      max: this.state.max || 0,
    });
  };

  render() {
    const { playing, currentTime, duration, max, min } = this.state;

    return (
      <div className="editor">
        <div className="video-container">
          <video
            className="video"
            src={"file://" + this.props.filePath}
            onLoadStart={this.onLoadStart}
          ></video>
        </div>
        {this.state.duration && this.state.duration > 0 && (
          <div className="control-container">
            <PlayButton
              currentTime={currentTime!}
              max={max!}
              min={min!}
              playing={playing}
              onPause={this.pause}
              onPlay={this.play}
            />
            <Progress
              duration={duration!}
              currentTime={currentTime!}
              min={min!}
              max={max!}
              onChange={this.sliderChange}
            />
            <Slider
              range
              defaultValue={[0, duration!]}
              min={0}
              max={duration!}
              onChange={this.rangeSliderChange}
              tipFormatter={(val) =>
                Util.sliderFormatter(val, { displayMilliseconds: true })
              }
            ></Slider>

            <Button onClick={this.onSave}>Save</Button>
          </div>
        )}
      </div>
    );
  }
}
