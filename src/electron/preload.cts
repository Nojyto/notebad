const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback: (statistics: any) => void) => {
    electron.ipcRenderer.on("statistics", (_, statistics) =>
      callback(statistics)
    );
  },
  getStaticData: () => electron.ipcRenderer.invoke("getStaticData"),
});
