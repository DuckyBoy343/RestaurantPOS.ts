import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';

const serverPath = path.resolve(__dirname, '../../server/dist/server.js');
const { app: serverApp } = require(serverPath);

const isDev = !app.isPackaged;
const serverPort = 4000;

if (!isDev) {
  const userDataPath = app.getPath('userData');
  const dbName = 'Restaurant.db';
  const destinationDbPath = path.join(userDataPath, dbName);
  const seedDbPath = path.join(process.resourcesPath, 'seed-db', dbName);

  if (!fs.existsSync(destinationDbPath)) {
    try {
      fs.copyFileSync(seedDbPath, destinationDbPath);
      console.log(`[DB] Database successfully copied to: ${destinationDbPath}`);
    } catch (error) {
      console.error('[DB] Failed to copy database:', error);
    }
  }
}

serverApp.listen(serverPort, () => {
  console.log(`✅ API server started on http://localhost:${serverPort}`);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const url = isDev
    ? 'http://localhost:3000/login'
    : `file://${path.join(__dirname, '../../client/out/login.html')}`;

  win.loadURL(url);

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});