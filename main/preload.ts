// main/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  navigate: (path: string) => ipcRenderer.send('navigate', path),
});