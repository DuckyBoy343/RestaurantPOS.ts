// server/types/electron.d.ts

declare namespace NodeJS {
  interface Process {
    /**
     * A string that represents the path to the app's resources directory.
     * This is only available in a packaged Electron app.
     */
    readonly resourcesPath: string;
  }
}