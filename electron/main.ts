import { app, BrowserWindow, ipcMain, dialog } from 'electron';
// import { createRequire } from 'node:module'
import fs from 'fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

ipcMain.handle('read-file', async (_, filePath: string) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('save-file', async (_, { filePath, content }: { filePath: string; content: string }) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('create-new-file', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Create New File',
    defaultPath: path.join(__dirname, 'untitled.txt'),
    buttonLabel: 'Create',
  });
  if (canceled || !filePath) return { success: false, error: 'File creation canceled' };

  try {
    await fs.writeFile(filePath, '', 'utf-8');
    return { success: true, filePath };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('show-open-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] });
  return canceled || filePaths.length === 0 ? { success: false, error: 'File open canceled' } : { success: true, filePath: filePaths[0] };
});