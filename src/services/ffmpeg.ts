import { Observable } from "rxjs";
import { Settings } from "./settings";
import { Util } from "./util";
const path = window.require("path");

const { spawn } = window.require("child_process");

export interface IExportOptions {
  min: number;
  max: number;
  outputFormat: "mp4" | "mp3" | "gif";
}

export class FFMPEG {
  static save(path: string, options: IExportOptions): Observable<string> {
    const one = Util.sliderFormatter(options.min, {
      displayHours: true,
      displayMilliseconds: true,
    });

    const two = Util.sliderFormatter(options.max - options.min, {
      displayHours: true,
      displayMilliseconds: true,
    });

    let additionalOptions: string[] = [];

    // If gif we must downscale otherwise file will be huge.
    // TODO: add these settings to output options.
    if (options.outputFormat === "gif") {
      additionalOptions = ["-vf", "fps=10,scale=640:-1:flags=lanczos"];
    }

    const proc = spawn(this.getExecutable(), [
      "-ss",
      one,
      "-y",
      "-i",
      path,
      ...additionalOptions,
      "-t",
      two,
      this.getOutputFileName(path, options),
    ]);

    return new Observable((o) => {
      proc.stdout.on("data", (data: unknown) => {
        o.next(String(data));
      });

      proc.stderr.on("data", (data: unknown) => {
        o.next(String(data));
      });

      proc.on("close", (code: unknown) => {
        console.log(`child process exited with code ${code}`);
        o.complete();
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
        out + `-${new Date().getTime()}.` + options.outputFormat
      );
    }
    return "";
  }

  private static getExecutable(): string {
    // TODO: get directory to executables
    return Util.isWindows() ? "ffmpeg/ffmpeg.exe" : "ffmpeg/ffmpeg";
  }
}
