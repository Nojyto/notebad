import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AppMenu from '../components/AppMenu';
import ConfirmDialog from '../components/ConfirmDialog';
import { useEditorShortcuts } from '../hooks/useEditorShortcuts';

interface TabData {
  id: string;
  title: string;
  content: string;
  filePath?: string;
  isSaved: boolean;
}

const getFileName = (filePath: string) => filePath.split(/[/\\]/).pop() || 'Untitled';

const EditorPage = () => {
  const [tabs, setTabs] = useState<TabData[]>([
    { id: crypto.randomUUID(), title: 'Untitled 1', content: '', isSaved: true },
  ]);
  const [untitledCount, setUntitledCount] = useState(2);
  const [activeIndex, setActiveIndex] = useState(0);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingTabIndex, setPendingTabIndex] = useState<number | null>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const textAreaRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map());

  const handleScroll = (e: React.WheelEvent) => {
    if (e.deltaY !== 0 && tabListRef.current) {
      tabListRef.current.scrollLeft += e.deltaY;
    }
  };

  const addTab = useCallback((title: string = `Untitled ${untitledCount}`, content: string = '', filePath?: string) => {
    const newTab: TabData = {
      id: crypto.randomUUID(),
      title: filePath ? getFileName(filePath) : title,
      content,
      filePath,
      isSaved: true,
    };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setUntitledCount((prev) => prev + 1);
    setActiveIndex(tabs.length);

    requestAnimationFrame(() => {
      const newTabRef = textAreaRefs.current.get(newTab.id);
      if (newTabRef) {
        newTabRef.focus();
      }
    });
  }, [tabs.length, untitledCount]);

  const closeTab = useCallback((index: number) => {
    const tabToClose = tabs[index];
    if (!tabToClose.isSaved) {
      setDialogOpen(true);
      setPendingTabIndex(index);
      return;
    }
    setTabs((prevTabs) => prevTabs.filter((_, i) => i !== index));
    setActiveIndex((prevIndex) => (index > 0 ? prevIndex - 1 : 0));
  }, [tabs]);

  const confirmCloseTab = () => {
    if (pendingTabIndex !== null) {
      setTabs((prevTabs) => prevTabs.filter((_, i) => i !== pendingTabIndex));
      setActiveIndex((prevIndex) => (pendingTabIndex > 0 ? prevIndex - 1 : 0));
    }
    setDialogOpen(false);
  };

  const cancelCloseTab = () => {
    setDialogOpen(false);
    setPendingTabIndex(null);
  };

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
    updatedTabs[index].title = getFileName(filePath);
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
        addTab(getFileName(filePath), result.content!, filePath);
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

  useEffect(() => {
    const activeTab = tabs[activeIndex];
    const textArea = textAreaRefs.current.get(activeTab?.id);
    if (textArea) {
      requestAnimationFrame(() => textArea.focus());
    }
  }, [activeIndex, tabs]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppMenu handleMenuClick={handleMenuClick} onToggleSpellCheck={setSpellCheckEnabled} />
      <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex} className="flex flex-col flex-1 p-2">
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
                    `flex-shrink-0 tab_width px-2 py-2 text-sm rounded-t ${
                      selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`
                  }
                >
                  <div
                    className="flex items-center justify-between"
                    title={tab.filePath || tab.title}
                  >
                    <div className="truncate flex-1">{getFileName(tab.title)}</div>
                    <div className="ml-1 text-red-500">{!tab.isSaved && '●'}</div>
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
                ref={(el) => el && textAreaRefs.current.set(tab.id, el)}
                value={tab.content}
                onChange={(e) => updateTabContent(index, e.target.value)}
                spellCheck={spellCheckEnabled}
                className="flex-1 w-full h-full border border-border rounded p-2 bg-card text-foreground resize-none focus:outline-none"
                placeholder="Start typing here..."
              />
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>

      <ConfirmDialog
        isOpen={dialogOpen}
        message="You have unsaved changes. Do you want to close this tab without saving?"
        onConfirm={confirmCloseTab}
        onCancel={cancelCloseTab}
      />
    </div>
  );
};

export default EditorPage;
