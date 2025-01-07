import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerIpcHandlers } from './handlers/ipcHandlers';
import { loadAppState } from './handlers/stateManager';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow(initialState: JSON) {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'desktop-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    frame: false,
    focusable: true,
  });

  registerIpcHandlers(win);

  if (VITE_DEV_SERVER_URL) {
    win.webContents.on('did-finish-load', () => {
      win?.webContents.send('main-process-message', (new Date).toLocaleString());
      win?.webContents.send('load-initial-state', initialState);
    });
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html')).then(() => {
      win?.webContents.send('load-initial-state', initialState);
    });
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const initialState = await loadAppState();
    createWindow(initialState);
  }
});

app.whenReady().then(async () => {
  const savedState = await loadAppState();
  createWindow(savedState);
});
