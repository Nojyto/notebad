import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useState } from 'react';
import ThemeToggleButton from '../components/ThemeToggleButton';

interface TabData {
  id: string;
  title: string;
  content: string;
}

const EditorPage = () => {
  const [tabs, setTabs] = useState<TabData[]>([
    { id: '1', title: 'Tab 1', content: 'Hello, world!' },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const addTab = () => {
    const newTab: TabData = {
      id: `${tabs.length + 1}`,
      title: `Tab ${tabs.length + 1}`,
      content: '',
    };
    setTabs([...tabs, newTab]);
    setActiveIndex(tabs.length);
  };

  const closeTab = (index: number) => {
    const updatedTabs = tabs.filter((_, i) => i !== index);
    setTabs(updatedTabs);
    if (activeIndex === index) {
      setActiveIndex(index > 0 ? index - 1 : 0);
    }
  };

  const updateTabContent = (index: number, content: string) => {
    const updatedTabs = tabs.map((tab, i) =>
      i === index ? { ...tab, content } : tab
    );
    setTabs(updatedTabs);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Editor Page</h1>
        <ThemeToggleButton />
      </div>
      <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex} className="flex flex-col flex-1">
        <TabList className="flex space-x-2 border-b border-border">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                `px-4 py-2 rounded-t ${
                  selected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`
              }
            >
              <div className="flex items-center space-x-2">
                <span>{tab.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(index);
                  }}
                  className="text-destructive"
                >
                  ✕
                </button>
              </div>
            </Tab>
          ))}
          <button
            onClick={addTab}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-t"
          >
            +
          </button>
        </TabList>
        <TabPanels className="flex-1 flex flex-col h-full">
          {tabs.map((tab, index) => (
            <TabPanel
              key={tab.id}
              className="flex-1 flex flex-col p-4 border border-border bg-popover text-popover-foreground rounded"
            >
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
