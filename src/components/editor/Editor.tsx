import { Button, Divider, Form, message, Select, Slider } from "antd";
import Plyr from "plyr";
import React from "react";
import { FFMPEG } from "../../services/ffmpeg";
import { Settings } from "../../services/settings";
import { Util } from "../../services/util";
import "./Editor.scss";
import { PlayButton } from "./PlayButton";
import { Progress } from "./Progress";

interface IProps {
  filePath: string;
}

interface IState {
  currentTime: number;
  duration: number;
  min: number;
  max: number;
  playing: boolean;
  ready: boolean;
  ffmpegOutput?: string;
  ffmpegOutputFinished: boolean;
}

export class Editor extends React.Component<IProps, IState> {
  private videoNode?: Plyr;

  constructor(props: IProps) {
    super(props);
    this.state = {
      playing: false,
      currentTime: 0,
      duration: 0,
      min: 0,
      max: 0,
      ready: false,
      ffmpegOutputFinished: false,
    };
  }

  public componentWillUnmount(): void {
    this.videoNode?.destroy();
  }

  play = (): void => {
    this.videoNode?.play();
    this.setState({ playing: true });
  };

  pause = (): void => {
    this.videoNode?.pause();
    this.setState({ playing: false });
  };

  setPlayerCurrentTime(val: number): void {
    if (this.videoNode) {
      this.videoNode.currentTime = val / 1000;
    }
  }

  onLoadStart = (): void => {
    const controls = ["volume", "mute", "duration"];
    this.videoNode = new Plyr(".video", {
      controls,
      keyboard: { focused: true, global: true },
    });

    this.videoNode.on("timeupdate", () => {
      if (this.videoNode) {
        let newTime = this.videoNode.currentTime * 1000;
        if (this.state.max && this.state.min && newTime > this.state.max) {
          newTime = this.state.min;

          this.videoNode.currentTime = newTime / 1000;
        }
        this.setState({
          currentTime: newTime,
        });
      }
    });
    this.videoNode.on("pause", () => {
      this.setState({ playing: false });
    });
    this.videoNode.on("play", () => {
      this.setState({ playing: true });
    });
    this.videoNode.on("ready", () => {
      this.videoNode?.pause();
      this.setState({ playing: false });
    });
    this.videoNode.on("canplay", () => {
      if (!this.state.ready && this.videoNode) {
        this.setState({
          duration: this.videoNode.duration * 1000,
          min: 0,
          max: this.videoNode.duration * 1000,
          ready: true,
        });
      }
    });
  };

  sliderChange = (val: number): void => {
    if (
      this.videoNode &&
      val >= (this.state.min || 0) &&
      val <= (this.state.max || Number.MAX_SAFE_INTEGER)
    ) {
      this.setPlayerCurrentTime(val);
      this.setState({
        currentTime: val,
      });
    }
  };

  rangeSliderChange = ([min, max]: number[]): void => {
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

  onFinish = ({
    outputFormat,
  }: {
    [key: string]: "mp3" | "gif" | "mp4";
  }): void => {
    message.loading({ content: "Rendering...", key: "outputMessage" });
    FFMPEG.save(this.props.filePath, {
      min: this.state.min || 0,
      max: this.state.max || 0,
      outputFormat,
    }).subscribe({
      next: (data: string) => {
        this.setState({
          ffmpegOutput: this.state.ffmpegOutput
            ? this.state.ffmpegOutput + data + "\n"
            : data + "\n",
        });
      },
      complete: () => {
        message.success({
          content: "Saved to: " + Settings.getOutputDirectory(),
          key: "outputMessage",
          duration: 2,
        });
        this.setState({
          ffmpegOutputFinished: true,
        });
      },
    });
  };

  private renderForm(): JSX.Element {
    return (
      <div style={{ maxWidth: "300px" }}>
        <Form onFinish={this.onFinish}>
          <Form.Item
            label="Output Format"
            name="outputFormat"
            initialValue={"mp4"}
          >
            <Select>
              <Select.Option value="mp4">mp4</Select.Option>
              <Select.Option value="gif">gif</Select.Option>
              <Select.Option value="mp3">mp3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  public render(): JSX.Element {
    const { playing, currentTime, duration, max, min, ready } = this.state;

    return (
      <div className="editor">
        <div className="video-container">
          <video
            className="video"
            src={"file://" + this.props.filePath}
            onLoadStart={this.onLoadStart}
          ></video>
        </div>
        {ready && (
          <div className="control-container">
            <PlayButton
              currentTime={currentTime}
              max={max}
              min={min}
              playing={playing}
              onPause={this.pause}
              onPlay={this.play}
            />
            <Progress
              duration={duration}
              currentTime={currentTime}
              min={min}
              max={max}
              onChange={this.sliderChange}
            />
            <Slider
              range
              defaultValue={[0, duration]}
              min={0}
              max={duration}
              onChange={this.rangeSliderChange}
              tipFormatter={(val) =>
                Util.sliderFormatter(val, { displayMilliseconds: true })
              }
            ></Slider>

            <Divider />

            {this.renderForm()}
            {!!this.state.ffmpegOutput && (
              <>
                <Divider orientation="left" plain>
                  FFMPEG Output
                </Divider>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {this.state.ffmpegOutput}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}
