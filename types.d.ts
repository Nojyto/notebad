interface Window {
  electron: {
    readFile: (filePath: string) => Promise<string>;
    writeFile: (filePath: string, content: string) => Promise<void>;
    openFileDialog: () => Promise<string | null>;
  };
}
