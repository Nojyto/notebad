import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useCallback, useRef, useState } from 'react';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { useEditorShortcuts } from '../hooks/useEditorShortcuts';

interface TabData {
  id: string;
  title: string;
  content: string;
  filePath?: string;
  isSaved: boolean;
}

const EditorPage = () => {
  const [tabs, setTabs] = useState<TabData[]>([
    { id: crypto.randomUUID(), title: 'Untitled 1', content: '', isSaved: true },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.WheelEvent) => {
    if (e.deltaY !== 0 && tabListRef.current) {
      tabListRef.current.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  const addTab = useCallback((title: string = `Untitled ${tabs.length + 1}`, content: string = '', filePath?: string) => {
    const newTab: TabData = { id: crypto.randomUUID(), title, content, filePath, isSaved: true };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveIndex(tabs.length);
  }, [tabs.length]);

  const closeTab = useCallback((index: number) => {
    const updatedTabs = tabs.filter((_, i) => i !== index);
    setTabs(updatedTabs);
    setActiveIndex(index > 0 ? index - 1 : 0);
  }, [tabs]);

  const updateTabContent = (index: number, content: string) => {
    const updatedTabs = tabs.map((tab, i) =>
      i === index ? { ...tab, content, isSaved: false } : tab
    );
    setTabs(updatedTabs);
  };

  const promptSaveAs = useCallback(async (index: number) => {
    const filePath = await window.api.createNewFile();
    if (!filePath) return false;

    const updatedTabs = [...tabs];
    updatedTabs[index].filePath = filePath;
    updatedTabs[index].title = filePath.split('/').pop()!;
    setTabs(updatedTabs);

    return true;
  }, [tabs]);

  const saveTab = useCallback(async (index: number) => {
    const tab = tabs[index];
    if (!tab.filePath) {
      const saved = await promptSaveAs(index);
      if (!saved) return;
    }

    const response = await window.api.saveFile(tabs[index].filePath!, tabs[index].content);
    if (response.success) {
      const updatedTabs = [...tabs];
      updatedTabs[index].isSaved = true;
      setTabs(updatedTabs);
    } else {
      console.error(`Failed to save file: ${response.error}`);
    }
  }, [tabs, promptSaveAs]);

  useEditorShortcuts({ saveTab, closeTab, activeIndex });

  const openFile = async () => {
    const filePath = await window.api.openFile();
    if (filePath) {
      const result = await window.api.readFile(filePath);
      if (result.success) {
        addTab(filePath.split('/').pop()!, result.content!, filePath);
      } else {
        console.error(`Failed to read file: ${result.error}`);
      }
    } else {
      console.warn('File open canceled');
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-heading">Code Editor</h1>
        <div className="flex gap-2">
          <button onClick={openFile} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80">
            Open File
          </button>
          <ThemeToggleButton />
        </div>
      </div>
      <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex} className="flex flex-col flex-1">
        <div className="flex items-center border-b border-border">
          <div
            ref={tabListRef}
            className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
            onWheel={handleScroll}
          >
            <TabList className="flex space-x-2">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    `flex-shrink-0 w-36 px-2 py-2 text-sm rounded-t ${
                      selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`
                  }
                >
                  <div className="flex items-center justify-between space-x-2">
                    <span className="truncate max-w-[8rem]">
                      {tab.title.length > 20
                        ? `${tab.title.slice(0, 10)}...${tab.title.slice(-10)}`
                        : tab.title}
                      {!tab.isSaved && <span className="text-red-500 ml-1">●</span>}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(index);
                      }}
                      className="text-destructive cursor-pointer"
                      role="button"
                      aria-label="Close Tab"
                    >
                      ✕
                    </span>
                  </div>
                </Tab>
              ))}
            </TabList>
          </div>
          <button onClick={() => addTab()} className="w-8 h-8 ml-2 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
            +
          </button>
        </div>
        <TabPanels className="flex-1 flex flex-col h-full">
          {tabs.map((tab, index) => (
            <TabPanel key={tab.id} className="flex-1 flex flex-col p-4 border border-border bg-popover text-popover-foreground rounded">
              <textarea
                value={tab.content}
                onChange={(e) => updateTabContent(index, e.target.value)}
                className="flex-1 w-full h-full border rounded p-2 bg-card text-foreground resize-none"
                placeholder="Start typing here..."
              />
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default EditorPage;
