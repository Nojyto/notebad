import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useCallback, useRef, useState } from 'react';
import AppMenu from '../components/AppMenu';
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

  const handleMenuClick = (menuItem: string) => {
    switch (menuItem) {
      case 'New File':
        addTab();
        break;
      case 'Open File':
        openFile();
        break;
      case 'Save File':
        saveTab(activeIndex);
        break;
      case 'Close Tab':
        closeTab(activeIndex);
        break;
      default:
        console.error(`Unknown menu item: ${menuItem}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppMenu handleMenuClick={handleMenuClick} />
      <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex} className="flex flex-col flex-1">
        <div className="flex items-center border-border">
          <div
            ref={tabListRef}
            className="flex-1 overflow-x-auto"
            onWheel={handleScroll}
          >
            <TabList className="flex space-x-2 focus:outline-none">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    `flex-shrink-0 w-30 px-2 py-2 text-sm rounded-t ${
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
            <TabPanel
              key={tab.id}
              className="flex-1 flex flex-col bg-popover text-popover-foreground rounded"
            >
              <textarea
                value={tab.content}
                onChange={(e) => updateTabContent(index, e.target.value)}
                className="flex-1 w-full h-full border border-border rounded p-2 bg-card text-foreground resize-none focus:outline-none"
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
