import { BrowserWindow } from 'electron';
import fs from 'fs';
import os from 'os';
import osUtils from 'os-utils';

const POLLING_INTERVAL = 2000;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    mainWindow.webContents.send('statistics', { cpuUsage, ramUsage, storageData });
    // console.log(`CPU: ${(cpuUsage * 100).toFixed(2)}%, RAM: ${(ramUsage * 100).toFixed(2)}%, Storage: ${storageData.usage}%`);
  }, POLLING_INTERVAL);
}

export function getSystemInfo() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemoryGB = os.totalmem() / 1024 / 1024 / 1024;

  return {
    cpuModel,
    totalMemoryGB: totalMemoryGB.toFixed(2),
    totalStorageGB: totalStorage,
  }
}

function getCpuUsage(): Promise<number> {
  return new Promise(resolve => {
    osUtils.cpuUsage(resolve);
  });
}

function getRamUsage(): number {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
  const totalSpace = stats.bsize * stats.blocks;
  const freeSpace = stats.bsize * stats.bfree;

  return {
    total: Math.floor(totalSpace / 1024 / 1024),
    usage: Math.floor(((totalSpace - freeSpace) / totalSpace) * 100),
  };
}