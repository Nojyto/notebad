/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
declare interface Window {
  ipcRenderer: import('electron').IpcRenderer
  api: Api;
}

interface Api {
  readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  saveFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
  openFile: () => Promise<string | null>;
  createNewFile: () => Promise<string | null>;
}