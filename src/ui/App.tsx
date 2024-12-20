import { useState } from "react";

type FileTab = {
  id: string;
  name: string;
  path?: string;
  content: string;
};

function App() {
  const [tabs, setTabs] = useState<FileTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const createNewTab = () => {
    const newTab: FileTab = {
      id: crypto.randomUUID(),
      name: "Untitled",
      content: "",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const openFile = async () => {
    const filePath = await window.electron.openFileDialog();
    if (filePath) {
      const fileContent = await window.electron.readFile(filePath);
      const fileName = filePath.split("/").pop() || "Untitled";
  
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
    if (activeTab && activeTab.path) {
      await window.electron.writeFile(activeTab.path, activeTab.content);
      alert("File saved!");
    } else {
      alert("No file to save or file path missing.");
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

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="flex flex-col h-screen">
      {/* Menu Bar */}
      <header className="bg-gray-800 text-white p-4 flex justify-between">
        <div>
          <button onClick={createNewTab} className="mr-4">
            New Tab
          </button>
          <button onClick={openFile} className="mr-4">
            Open File
          </button>
          <button onClick={saveFile}>Save File</button>
        </div>
      </header>

      {/* Tab Bar */}
      <nav className="flex bg-gray-700 text-white p-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`px-4 py-2 cursor-pointer ${
              tab.id === activeTabId ? "bg-gray-600" : ""
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="ml-2 text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </nav>

      {/* Editor */}
      <main className="flex-1 p-4">
        {activeTab ? (
          <textarea
            className="w-full h-full border rounded p-2"
            value={activeTab.content}
            onChange={(e) => updateTabContent(activeTab.id, e.target.value)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No file open
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
