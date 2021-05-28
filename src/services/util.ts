export interface IFormatterOptions {
  displayMilliseconds?: boolean;
  displayHours?: boolean;
}

export class Util {
  static isWindows(): boolean {
    return process.platform === "win32";
  }

  /** Format time in milliseconds */
  static sliderFormatter(
    duration?: number,
    options?: IFormatterOptions
  ): string {
    if (!duration) {
      return "0:00";
    }

    duration = duration / 1000;

    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
    const split = String(duration).split(".");
    let milliseconds;
    if (split.length > 1) {
      milliseconds = split[1];
    }

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (options?.displayHours) {
      ret += "" + (hrs < 10 ? "0" : "") + hrs + ":";
    }

    ret += (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    if (milliseconds && options?.displayMilliseconds) {
      ret += "." + milliseconds;
    }
    return ret;
  }

  static onFileClick = (filePath: (_: string) => void): void => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement)?.files?.[0];
      if (file) {
        filePath(file.path);
      }
      if (document.contains(input)) {
        document.removeChild(input);
      }
    };
    input.click();
  };
}
