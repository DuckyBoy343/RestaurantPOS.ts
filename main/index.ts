import { app, BrowserWindow, protocol } from 'electron';
import path from 'path';
import * as fs from 'fs';
import { ipcMain } from 'electron';

const isDev = !app.isPackaged;
const serverPort = 4000;

function setupDatabase() {
  if (isDev) return;
  // ... (This function remains the same as before)
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

  // Updated IPC handler with better query parameter handling
  ipcMain.on('navigate', (event, pathWithQuery) => {
    // Parse the URL properly
    const url = new URL(pathWithQuery, 'http://localhost'); // Use dummy base for parsing
    const pathname = url.pathname;
    const queryString = url.search; // This includes the '?' prefix

    let newUrl = '';

    // Handle the root path
    if (pathname === '/' || pathname === '/login') {
      newUrl = `app-protocol://client/out/login.html`;
    } else {
      // Construct the correct file path
      newUrl = `app-protocol://client/out${pathname}.html`;
    }
    
    // Add query parameters back if they exist
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

app.whenReady().then(() => {
  setupDatabase();

  // Define the production paths
  const prodDbPath = path.join(app.getPath('userData'), 'Restaurant.db');
  const prodEnvPath = path.join(process.resourcesPath, '.env');

  // Start the server and PASS both paths to it
  const serverPath = path.resolve(__dirname, '../../server/dist/server.js');
  const { startServer } = require(serverPath);
  startServer(prodDbPath, prodEnvPath);

  // Register the protocol handler - using buffer protocol for better control
  protocol.registerBufferProtocol('app-protocol', (request, callback) => {
    try {
      // Parse the URL and remove query parameters
      const url = new URL(request.url);
      const pathWithoutQuery = url.pathname;
      const cleanPath = pathWithoutQuery.replace('/client/', '');
      const filePath = path.join(process.resourcesPath, 'client', cleanPath);
      
      console.log(`[Protocol] Original URL: ${request.url}`);
      console.log(`[Protocol] Clean path: ${cleanPath}`);
      console.log(`[Protocol] File path: ${filePath}`);
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const extension = path.extname(filePath).toLowerCase();
        
        // Determine MIME type
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
        }
        
        callback({
          mimeType,
          data
        });
      } else {
        console.error(`[Protocol] File not found: ${filePath}`);
        callback({ error: -6 }); // FILE_NOT_FOUND
      }
    } catch (error) {
      console.error('[Protocol] Error:', error);
      callback({ error: -2 }); // GENERIC_FAILURE
    }
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});