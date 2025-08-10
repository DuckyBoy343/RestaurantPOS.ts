"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
// IMPORTANT: We are importing the COMPILED JavaScript version of your server
// This path assumes your server's tsconfig.json compiles to a 'dist' folder
const server_js_1 = require("../server/dist/server.js");
const isDev = !electron_1.app.isPackaged;
const serverPort = 3001; // The port your backend will run on
// --- 1. Start the Backend Server ---
server_js_1.app.listen(serverPort, () => {
    console.log(`✅ API server started on http://localhost:${serverPort}`);
});
function createWindow() {
    // --- 2. Create the Browser Window ---
    const win = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, 'preload.js'), // Points to the compiled preload.js
        },
    });
    // --- 3. Load the Frontend ---
    // In development, we load the Next.js dev server.
    // In production, we load the static HTML file.
    const url = isDev
        ? 'http://localhost:3000' // URL of the Next.js dev server
        : `file://${path_1.default.join(__dirname, '../../client/out/index.html')}`;
    win.loadURL(url);
    // Open the DevTools automatically if in development
    if (isDev) {
        win.webContents.openDevTools();
    }
}
// This method will be called when Electron has finished initialization
electron_1.app.whenReady().then(createWindow);
// Standard macOS behavior
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//# sourceMappingURL=index.js.map