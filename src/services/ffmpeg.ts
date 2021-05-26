import { Settings } from "./settings";
import { Util } from "./util";
const path = window.require("path");

const { spawn } = window.require("child_process");

export interface IExportOptions {
  min: number;
  max: number;
  outputType: "mp4" | "mp3";
}

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

    const proc = spawn(this.getExecutable(), [
      "-ss",
      one,
      "-y",
      "-i",
      path,
      "-t",
      two,
      this.getOutputFileName(path, options),
    ]);

    return new Promise((res) => {
      proc.stdout.on("data", (data: unknown) => {
        console.log(`stdout: ${data}`);
      });

      proc.stderr.on("data", (data: unknown) => {
        console.error(`stderr: ${data}`);
      });

      proc.on("close", (code: unknown) => {
        console.log(`child process exited with code ${code}`);
        res();
      });
    });
  }

  private static getOutputFileName(
    filePath: string,
    options: IExportOptions
  ): string {
    const s = filePath.split(path.sep);
    if (s.length > 0) {
      const fileName = s[s.length - 1];
      const out = fileName.split(".")[0];
      return path.join(
        Settings.getOutputDirectory(),
        out + `-${new Date().getTime()}.` + options.outputType
      );
    }
    return "";
  }

  private static getExecutable(): string {
    // TODO: get directory to executables
    return Util.isWindows() ? "ffmpeg/ffmpeg.exe" : "ffmpeg/ffmpeg";
  }
}
