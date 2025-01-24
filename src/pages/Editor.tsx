import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useState } from 'react';
import AppMenu from '../components/AppMenu';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import StatusBar from '../components/StatusBar';
import { useEditorShortcuts } from '../hooks/useEditorShortcuts';
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

  const [isSearchVisible, setSearchVisible] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);

  const highlightMatch = (index: number, length: number) => {
    const textArea = textAreaRefs.current.get(tabs[activeIndex]?.id);
    if (textArea && index >= 0) {
      textArea.focus();
      textArea.setSelectionRange(index, index + length);

      const startLine = textArea.value.substring(0, index).split('\n').length - 1;
      const lineHeight = parseFloat(getComputedStyle(textArea).lineHeight || '20px');
      const scrollPosition = startLine * lineHeight - textArea.clientHeight / 2;

      textArea.scrollTop = Math.max(scrollPosition, 0);
    }
  };

  useEditorShortcuts({ saveTab, closeTab, activeIndex, setSearchVisible });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppMenu
        handleMenuClick={(menuItem) => {
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
        }}
        spellCheckEnabled={spellCheckEnabled}
        onToggleSpellCheck={() => setSpellCheckEnabled(!spellCheckEnabled)}
      />

      <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex} className="flex flex-col flex-1">
        <div className="flex items-center border-border px-1">
          <div ref={tabListRef} className="flex-1 overflow-x-auto scrollbar-small" onWheel={handleScroll}>
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
            <TabPanel key={tab.id} className="relative flex-1 flex flex-col bg-popover text-popover-foreground">
              <SearchBar
                isVisible={isSearchVisible}
                content={tab.content}
                onHighlight={highlightMatch}
                onContentReplace={(updatedContent) => { updateTabContent(activeIndex, updatedContent); }}
                onClose={() => setSearchVisible(false)}
              />

              <textarea
                ref={(el) => el && textAreaRefs.current.set(tab.id, el)}
                value={tab.content}
                onChange={(e) => updateTabContent(index, e.target.value)}
                onSelect={(e) => {
                  const textArea = e.target as HTMLTextAreaElement;
                  setSelectionStart(textArea.selectionStart);
                }}
                spellCheck={spellCheckEnabled}
                className="flex-1 w-full h-full border border-b-0 border-l-0 border-r-0 border-border rounded-b-xl p-2 bg-card text-foreground resize-none focus:outline-none whitespace-nowrap"
                placeholder="Start typing here..."
              />

              <StatusBar
                content={tab.content}
                selectionStart={selectionStart}
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
