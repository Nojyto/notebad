import { useState } from 'react';
import { useTheme } from './useTheme';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

interface TabData {
  id: string;
  title: string;
  content: string;
}

const EditorPage = () => {
  const { theme, toggleTheme } = useTheme();
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
    <div className="flex flex-col min-h-screen p-4 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Editor Page</h1>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
        >
          Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>
        <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex} className="flex flex-col flex-1">
          <TabList className="flex space-x-2 border-b border-[hsl(var(--border))]">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.id}
                className={({ selected }) =>
                  `px-4 py-2 rounded-t ${
                    selected
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]'
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
                    className="text-[hsl(var(--destructive))]"
                  >
                    ✕
                  </button>
                </div>
              </Tab>
            ))}
            <button
              onClick={addTab}
              className="px-4 py-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] rounded-t"
            >
              +
            </button>
          </TabList>
          <TabPanels className="flex-1 flex flex-col h-full">
            {tabs.map((tab, index) => (
              <TabPanel
                key={tab.id}
                className="flex-1 flex flex-col p-4 border border-[hsl(var(--border))] bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))] rounded"
              >
                <textarea
                  value={tab.content}
                  onChange={(e) => updateTabContent(index, e.target.value)}
                  className="flex-1 w-full h-full border rounded p-2 bg-[hsl(var(--card))] text-[hsl(var(--foreground))] resize-none"
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
