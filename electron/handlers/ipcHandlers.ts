import { BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'fs/promises';
import path from 'node:path';
import { saveAppState, loadAppState } from './stateManager';

export function registerIpcHandlers(win: BrowserWindow | null) {
  ipcMain.on('minimize', () => {
    win?.minimize();
  });
  
  ipcMain.on('maximize', () => {
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });
  
  ipcMain.on('close', () => {
    win?.close();
  });
  
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
  
  ipcMain.handle('save-state', async (_, state) => {
    await saveAppState(state);
  });
  
  ipcMain.handle('load-state', async () => {
    return loadAppState();
  });  
}
