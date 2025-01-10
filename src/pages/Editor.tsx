import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import AppMenu from '../components/AppMenu';
import ConfirmDialog from '../components/ConfirmDialog';
import { useEditorState } from '../hooks/useEditorState';
import { TabData } from '../types/types';

const EditorPage = () => {
  const {
    tabs,
    activeIndex,
    spellCheckEnabled,
    dialogOpen,
    tabListRef,
    textAreaRefs,
    handleScroll,
    setActiveIndex,
    addTab,
    closeTab,
    saveAsTab,
    confirmCloseTab,
    cancelCloseTab,
    updateTabContent,
    saveTab,
    openFile,
    setSpellCheckEnabled,
  } = useEditorState();

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
      case 'Save File As':
        saveAsTab(activeIndex);
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
      <AppMenu
        handleMenuClick={handleMenuClick}
        spellCheckEnabled={spellCheckEnabled}
        onToggleSpellCheck={() => setSpellCheckEnabled(!spellCheckEnabled)}
      />
      <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex} className="flex flex-col flex-1">
        <div className="flex items-center border-border px-1">
          <div ref={tabListRef} className="flex-1 overflow-x-auto" onWheel={handleScroll}>
            <TabList className="flex space-x-2 focus:outline-none pt-1">
              {tabs.map((tab: TabData, index: number) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    `flex-shrink-0 tab-width px-2 py-2 text-sm rounded-t ${
                      selected ? 'bg-primary text-primary-foreground hover:bg-destructive' : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    }`
                  }
                >
                  <div className="flex items-center justify-between" title={tab.filePath || tab.title}>
                    <div className="truncate flex-1">{tab.title}</div>
                    <div className="mx-1 text-red-500">{!tab.isSaved && '●'}</div>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(index);
                      }}
                      className="text-destructive cursor-pointer hover:text-destructive-foreground"
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
          <button onClick={() => addTab()} className="w-8 h-8 ml-2 bg-accent text-accent-foreground rounded-xl flex items-center justify-center text-justify hover:bg-destructive">
            +
          </button>
        </div>
        <TabPanels className="flex-1 flex flex-col h-full">
          {tabs.map((tab: TabData, index: number) => (
            <TabPanel key={tab.id} className="flex-1 flex flex-col bg-popover text-popover-foreground">
              <textarea
                ref={(el) => el && textAreaRefs.current.set(tab.id, el)}
                value={tab.content}
                onChange={(e) => updateTabContent(index, e.target.value)}
                spellCheck={spellCheckEnabled}
                className="flex-1 w-full h-full border border-b-0 border-l-0 border-r-0 border-border rounded-b-xl p-2 bg-card text-foreground resize-none focus:outline-none"
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
