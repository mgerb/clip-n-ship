import { App } from "electron";
const electron = window.require("electron");
const path = window.require("path");
const fs = window.require("fs");
const app: App = electron.remote.app;

class _Settings {
  private outputDirectory: string;
  private appDataPath: string;

  constructor() {
    // defaults
    this.outputDirectory = app.getPath("videos");
    this.appDataPath = app.getPath("appData");

    try {
      const f = fs.readFileSync(path.join(this.appDataPath, "settings.json"));
      console.log(JSON.parse(f));
      Object.assign(this, JSON.parse(f));
    } catch (e) {
      // unable to read settings file
      this.saveSettings();
    }
  }

  public getOutputDirectory(): string {
    return this.outputDirectory;
  }

  public setOutputDirectory(outputDirectory: string): void {
    this.outputDirectory = outputDirectory;
    this.saveSettings();
  }

  public saveSettings(): void {
    fs.writeFileSync(
      path.join(this.appDataPath, "settings.json"),
      JSON.stringify(this)
    );
  }
}

export const Settings = new _Settings();
