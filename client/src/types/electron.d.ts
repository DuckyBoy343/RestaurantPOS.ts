export interface IElectronAPI {
  navigate: (path: string) => void,
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}