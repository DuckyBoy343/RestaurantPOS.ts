import { app, BrowserWindow, protocol } from 'electron';
import path from 'path';
import * as fs from 'fs';
import { ipcMain } from 'electron';

const isDev = !app.isPackaged;
const serverPort = 4000;

function setupDatabase() {
  if (isDev) return;
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

  if (isDev) {
    win.loadURL('http://localhost:3000/login');
    win.webContents.openDevTools();
  } else {
    win.loadURL('app-protocol://client/out/login.html');
  }

  ipcMain.on('navigate', (event, pathWithQuery) => {
    const url = new URL(pathWithQuery, 'http://localhost');
    const pathname = url.pathname;
    const queryString = url.search;

    let newUrl = '';

    if (pathname === '/' || pathname === '/login') {
      newUrl = `app-protocol://client/out/login.html`;
    } else {
      newUrl = `app-protocol://client/out${pathname}.html`;
    }
    
    if (queryString) {
      newUrl += queryString;
    }

    console.log(`[IPC Navigate] Attempting to load URL: ${newUrl}`);
    win.loadURL(newUrl);
  });

  return win;
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'app-protocol', privileges: { secure: true, standard: true, supportFetchAPI: true } },
]);

function debugFileStructure(): void {
  const clientPath = path.join(process.resourcesPath, 'client');
  console.log(`[DEBUG] Client path: ${clientPath}`);
  
  try {
    const listFiles = (dir: string, prefix: string = ''): void => {
      const files = fs.readdirSync(dir);
      files.forEach((file: string) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          console.log(`[DEBUG] ${prefix}📁 ${file}/`);
          if (prefix.length < 20) {
            listFiles(filePath, prefix + '  ');
          }
        } else {
          console.log(`[DEBUG] ${prefix}📄 ${file}`);
        }
      });
    };
    
    listFiles(clientPath);
  } catch (error) {
    console.error('[DEBUG] Error reading client directory:', error);
  }
}

app.whenReady().then(() => {
  setupDatabase();

  const prodDbPath = path.join(app.getPath('userData'), 'Restaurant.db');
  const prodEnvPath = path.join(process.resourcesPath, '.env');

  const serverPath = path.resolve(__dirname, '../../server/dist/server.js');
  const { startServer } = require(serverPath);
  startServer(prodDbPath, prodEnvPath);

  protocol.registerBufferProtocol('app-protocol', (request, callback) => {
    try {
      const url = new URL(request.url);
      const pathWithoutQuery = url.pathname;
      
      let cleanPath = pathWithoutQuery;
      
      if (cleanPath.startsWith('/client/')) {
        cleanPath = cleanPath.replace('/client/', '');
      }
      
      let filePath;
      
      if (cleanPath.includes('/_next/')) {
        const nextIndex = cleanPath.indexOf('/_next/');
        const nextPath = cleanPath.substring(nextIndex + 1);
        filePath = path.join(process.resourcesPath, 'client', 'out', nextPath);
      } else if (cleanPath.startsWith('out/_next/') || cleanPath.startsWith('/_next/')) {
        const nextPath = cleanPath.replace(/^\/?out\/?/, '').replace(/^\/?_next\//, '_next/');
        filePath = path.join(process.resourcesPath, 'client', 'out', nextPath);
      } else if (cleanPath.startsWith('out/')) {
        filePath = path.join(process.resourcesPath, 'client', cleanPath);
      } else {
        filePath = path.join(process.resourcesPath, 'client', 'out', cleanPath);
      }
      
      console.log(`[Protocol] Original URL: ${request.url}`);
      console.log(`[Protocol] Clean path: ${cleanPath}`);
      console.log(`[Protocol] File path: ${filePath}`);
      
      const possiblePaths = [
        filePath,
        path.join(process.resourcesPath, 'client', cleanPath),
        path.join(process.resourcesPath, 'client', 'out', cleanPath)
      ];
      
      let foundPath = null;
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          foundPath = possiblePath;
          break;
        }
      }
      
      if (foundPath) {
        const data = fs.readFileSync(foundPath);
        const extension = path.extname(foundPath).toLowerCase();
        
        let mimeType = 'text/plain';
        switch (extension) {
          case '.html':
            mimeType = 'text/html';
            break;
          case '.css':
            mimeType = 'text/css';
            break;
          case '.js':
            mimeType = 'application/javascript';
            break;
          case '.json':
            mimeType = 'application/json';
            break;
          case '.png':
            mimeType = 'image/png';
            break;
          case '.jpg':
          case '.jpeg':
            mimeType = 'image/jpeg';
            break;
          case '.svg':
            mimeType = 'image/svg+xml';
            break;
          case '.ico':
            mimeType = 'image/x-icon';
            break;
          case '.woff':
          case '.woff2':
            mimeType = 'font/woff2';
            break;
          case '.ttf':
            mimeType = 'font/ttf';
            break;
        }
        
        console.log(`[Protocol] File found at: ${foundPath}`);
        callback({
          mimeType,
          data
        });
      } else {
        console.error(`[Protocol] File not found in any of these locations:`);
        possiblePaths.forEach(p => console.error(`  - ${p}`));
        callback({ error: -6 }); // FILE_NOT_FOUND
      }
    } catch (error) {
      console.error('[Protocol] Error:', error);
      callback({ error: -2 }); // GENERIC_FAILURE
    }
  });

  debugFileStructure();

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});