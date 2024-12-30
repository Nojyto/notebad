import { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

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
    <div className="p-4">
      <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex}>
        <TabList className="flex space-x-2">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                `px-4 py-2 rounded-t ${
                  selected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
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
                >
                  ✕
                </button>
              </div>
            </Tab>
          ))}
          <button
            onClick={addTab}
            className="px-4 py-2 bg-green-500 text-white rounded-t"
          >
            +
          </button>
        </TabList>
        <TabPanels>
          {tabs.map((tab, index) => (
            <TabPanel key={tab.id} className="p-4 border border-t-0">
              <textarea
                value={tab.content}
                onChange={(e) => updateTabContent(index, e.target.value)}
                className="w-full h-64 border rounded p-2"
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
