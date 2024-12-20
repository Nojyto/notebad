import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import { getPreloadPath, isDev } from "./util.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
  }
});

ipcMain.handle("read-file", async (_, filePath) => {
  return fs.promises.readFile(filePath, "utf8");
});

ipcMain.handle("write-file", async (_, filePath, content) => {
  await fs.promises.writeFile(filePath, content, "utf8");
});

ipcMain.handle("open-file-dialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
  });
  return result.filePaths[0] || null;
});