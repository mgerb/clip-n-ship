import { Util } from "./util";

const { spawn } = window.require("child_process");

export interface IExportOptions {
  min: number;
  max: number;
}

/** TODO: */
export class FFMPEG {
  static save(path: string, options: IExportOptions): Promise<void> {
    const one = Util.sliderFormatter(options.min, {
      displayHours: true,
      displayMilliseconds: true,
    });

    const two = Util.sliderFormatter(options.max - options.min, {
      displayHours: true,
      displayMilliseconds: true,
    });

    const proc = spawn("ffmpeg", [
      "-ss",
      one,
      "-y",
      "-i",
      path,
      "-t",
      two,
      "output.mp4",
    ]);

    return new Promise((res) => {
      proc.stdout.on("data", (data: any) => {
        console.log(`stdout: ${data}`);
      });

      proc.stderr.on("data", (data: any) => {
        console.error(`stderr: ${data}`);
      });

      proc.on("close", (code: any) => {
        console.log(`child process exited with code ${code}`);
        res();
      });
    });
  }
}
