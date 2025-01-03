import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useState } from 'react';
import ThemeToggleButton from '../components/ThemeToggleButton';

interface TabData {
  id: string;
  title: string;
  content: string;
  filePath?: string;
}

const EditorPage = () => {
  const [tabs, setTabs] = useState<TabData[]>([
    { id: '1', title: 'Untitled', content: '' },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const addTab = (title: string, content: string, filePath?: string) => {
    const newTab: TabData = { id: `${tabs.length + 1}`, title, content, filePath };
    setTabs([...tabs, newTab]);
    setActiveIndex(tabs.length);
  };

  const closeTab = (index: number) => {
    const updatedTabs = tabs.filter((_, i) => i !== index);
    setTabs(updatedTabs);
    setActiveIndex(index > 0 ? index - 1 : 0);
  };

  const updateTabContent = (index: number, content: string) => {
    const updatedTabs = tabs.map((tab, i) => (i === index ? { ...tab, content } : tab));
    setTabs(updatedTabs);
  };

  const openFile = async () => {
    const filePath = await window.api.openFile();
    if (filePath) {
      const result = await window.api.readFile(filePath);
      if (result.success) {
        addTab(filePath.split('/').pop()!, result.content!, filePath);
      } else {
        alert(`Failed to read file: ${result.error}`);
      }
    } else {
      alert('File open canceled');
    }
  };

  const createNewFile = async () => {
    const filePath = await window.api.createNewFile();
    if (filePath) {
      addTab('New File', '', filePath);
    } else {
      alert('File creation canceled');
    }
  };

  const saveTab = async (index: number) => {
    const tab = tabs[index];
    if (!tab.filePath) {
      alert('Please select a file path before saving.');
      return;
    }
    const response = await window.api.saveFile(tab.filePath, tab.content);
    if (response.success) {
      alert('File saved successfully!');
    } else {
      alert(`Failed to save file: ${response.error}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-heading">Code Editor</h1>
        <div className="flex gap-2">
          <button onClick={createNewFile} className="px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/80">
            New File
          </button>
          <button onClick={openFile} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80">
            Open File
          </button>
          <ThemeToggleButton />
        </div>
      </div>
      <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex} className="flex flex-col flex-1">
        <TabList className="flex space-x-2 border-b border-border">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                `px-4 py-2 rounded-t ${selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`
              }
            >
              <div className="flex items-center space-x-2">
                <span>{tab.title}</span>
                <button onClick={(e) => { e.stopPropagation(); closeTab(index); }} className="text-destructive">
                  ✕
                </button>
              </div>
            </Tab>
          ))}
        </TabList>
        <TabPanels className="flex-1 flex flex-col h-full">
          {tabs.map((tab, index) => (
            <TabPanel key={tab.id} className="flex-1 flex flex-col p-4 border border-border bg-popover text-popover-foreground rounded">
              <textarea
                value={tab.content}
                onChange={(e) => updateTabContent(index, e.target.value)}
                className="flex-1 w-full h-full border rounded p-2 bg-card text-foreground resize-none"
                placeholder="Start typing here..."
              />
              <div className="mt-2 flex justify-end">
                <button onClick={() => saveTab(index)} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80">
                  Save
                </button>
              </div>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default EditorPage;
