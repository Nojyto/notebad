import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getPreloadPath } from "./pathResolver.js";
import { getSystemInfo, pollResources } from './resourceManagers.js';
import { isDev } from "./util.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath(),
		},
	});
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
  }

	pollResources(mainWindow);

	ipcMain.handle('getStaticData', () => getSystemInfo());
});
