import { useEffect, useState } from "react";

type FileTab = {
  id: string;
  name: string;
  path?: string;
  content: string;
};

function App() {
  const [tabs, setTabs] = useState<FileTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const createNewTab = () => {
    const newTab: FileTab = {
      id: crypto.randomUUID(),
      name: "Untitled.txt",
      content: "",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const openFile = async () => {
    const filePath = await window.electron.openFileDialog();
    if (filePath) {
      const fileContent = await window.electron.readFile(filePath);
      const fileName = filePath.split("/").pop() || "Untitled.txt";

      const existingTab = tabs.find((tab) => tab.path === filePath);
      if (existingTab) {
        setActiveTabId(existingTab.id);
      } else {
        const newTab: FileTab = {
          id: crypto.randomUUID(),
          name: fileName,
          path: filePath,
          content: fileContent,
        };
        setTabs((prev) => [...prev, newTab]);
        setActiveTabId(newTab.id);
      }
    }
  };

  const saveFile = async () => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (activeTab) {
      if (activeTab.path) {
        await window.electron.writeFile(activeTab.path, activeTab.content);
      } else {
        const filePath = await window.electron.openFileDialog();
        if (filePath) {
          activeTab.path = filePath;
          activeTab.name = filePath.split("/").pop() || "Untitled.txt";
          await window.electron.writeFile(filePath, activeTab.content);
          setTabs([...tabs]); // Trigger re-render
        }
      }
      alert("File saved!");
    } else {
      alert("No file to save.");
    }
  };

  const closeTab = (id: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (activeTabId === id) {
      setActiveTabId(tabs.length > 1 ? tabs[0].id : null);
    }
  };

  const updateTabContent = (id: string, content: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, content } : tab))
    );
  };

  const updateTabName = (id: string, name: string) => {
    setTabs((prev) =>
      prev.map((tab) => {
        const cleanName = name.endsWith(".txt")
          ? name
          : name.replace(/\.txt.*$/, "") + ".txt"; // Prevent repeated ".txt"
        return tab.id === id ? { ...tab, name: cleanName } : tab;
      })
    );
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="flex flex-col h-screen">
      {/* Menu Bar */}
      <header className="bg-[hsl(var(--primary))] text-[hsl(var(--text))] p-4 flex justify-between items-center shadow">
        <div>
          <button
            onClick={openFile}
            className="mr-4 px-4 py-2 rounded focus:outline focus:outline-[hsl(var(--accent))] hover:bg-[hsl(var(--secondary))]"
          >
            Open File
          </button>
          <button
            onClick={saveFile}
            className="px-4 py-2 rounded focus:outline focus:outline-[hsl(var(--accent))] hover:bg-[hsl(var(--secondary))]"
          >
            Save File
          </button>
        </div>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded focus:outline focus:outline-[hsl(var(--accent))] hover:bg-[hsl(var(--secondary))]"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* Tab Bar */}
      <nav className="flex items-center bg-[hsl(var(--primary))] text-[hsl(var(--text))] px-2 py-1 shadow">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`group flex items-center px-4 py-2 cursor-pointer ${
              tab.id === activeTabId ? "bg-[hsl(var(--secondary))] rounded-t" : "hover:bg-[hsl(var(--secondary))]"
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <input
              className="bg-transparent border-none text-[hsl(var(--text))] focus:outline-none"
              value={tab.name}
              onChange={(e) => updateTabName(tab.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="ml-2 text-red-400 hover:text-red-600 opacity-50 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={createNewTab}
          className="ml-2 px-4 py-2 bg-[hsl(var(--accent))] text-[hsl(var(--background))] rounded hover:bg-[hsl(var(--secondary))]"
        >
          +
        </button>
      </nav>

      {/* Editor */}
      <main className="flex-1 bg-[hsl(var(--background))] p-4">
        {activeTab ? (
          <textarea
            className="w-full h-full p-4 text-[hsl(var(--text))] bg-[hsl(var(--background))] border-none outline-none rounded resize-none"
            value={activeTab.content}
            onChange={(e) => updateTabContent(activeTab.id, e.target.value)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-[hsl(var(--text))]">
            No file open
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
