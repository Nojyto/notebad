import { useCallback, useEffect, useRef, useState } from 'react';
import { TabData } from '../types/types';
import { getFileName } from '../utils/utils';
import { useEditorShortcuts } from './useEditorShortcuts';

const LOCAL_STORAGE_KEY = 'editorState';

export const useEditorState = () => {
  const loadInitialState = () => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      // console.log('Loaded state from localStorage:', JSON.parse(savedState));
      const { tabs, activeIndex, spellCheckEnabled } = JSON.parse(savedState);
      return {
        tabs,
        activeIndex,
        spellCheckEnabled,
      };
    }

    return {
      tabs: [{ id: crypto.randomUUID(), title: 'Untitled 1', content: '', isSaved: true }],
      activeIndex: 0,
      spellCheckEnabled: false,
    };
  };

  const [state, setState] = useState(loadInitialState);
  const { tabs, activeIndex } = state;
  const [untitledCount, setUntitledCount] = useState(tabs.length + 1);
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
    setState((prevState) => ({
      ...prevState,
      tabs: [...prevState.tabs, newTab],
      activeIndex: prevState.tabs.length,
    }));
    setUntitledCount((prev: number) => prev + 1);

    requestAnimationFrame(() => {
      const newTabRef = textAreaRefs.current.get(newTab.id);
      if (newTabRef) {
        newTabRef.focus();
      }
    });
  }, [untitledCount]);

  const closeTab = useCallback((index: number) => {
    const tabToClose = tabs[index];
    if (!tabToClose.isSaved) {
      setDialogOpen(true);
      setPendingTabIndex(index);
      return;
    }
    setState((prevState) => ({
      ...prevState,
      tabs: prevState.tabs.filter((_: TabData, i: number) => i !== index),
      activeIndex: index > 0 ? index - 1 : 0,
    }));
  }, [tabs]);

  const confirmCloseTab = () => {
    if (pendingTabIndex !== null) {
      setState((prevState) => ({
        ...prevState,
        tabs: prevState.tabs.filter((_: TabData, i: number) => i !== pendingTabIndex),
        activeIndex: pendingTabIndex > 0 ? pendingTabIndex - 1 : 0,
      }));
    }
    setDialogOpen(false);
  };

  const cancelCloseTab = () => {
    setDialogOpen(false);
    setPendingTabIndex(null);
  };

  const updateTabContent = (index: number, content: string) => {
    setState((prevState) => {
      const updatedTabs = prevState.tabs.map((tab: TabData, i: number) =>
        i === index ? { ...tab, content, isSaved: false } : tab
      );
      return { ...prevState, tabs: updatedTabs };
    });
  };

  const promptSaveAs = useCallback(async (index: number) => {
    const filePath = await window.api.createNewFile();
    if (!filePath) return false;

    setState((prevState) => {
      const updatedTabs = [...prevState.tabs];
      updatedTabs[index].filePath = filePath;
      updatedTabs[index].title = getFileName(filePath);
      return { ...prevState, tabs: updatedTabs };
    });

    return true;
  }, []);

  const saveTab = useCallback(async (index: number) => {
    const tab = tabs[index];
    if (!tab.filePath) {
      const saved = await promptSaveAs(index);
      if (!saved) return;
    }

    const response = await window.api.saveFile(tabs[index].filePath!, tabs[index].content);
    if (response.success) {
      setState((prevState) => {
        const updatedTabs = [...prevState.tabs];
        updatedTabs[index].isSaved = true;
        return { ...prevState, tabs: updatedTabs };
      });
    } else {
      console.error(`Failed to save file: ${response.error}`);
    }
  }, [tabs, promptSaveAs]);

  const saveAsTab = useCallback(async (index: number) => {
    const tab = tabs[index];
    const response: { success: boolean; filePath?: string; error?: string } = await window.api.saveAs(tab.content);

    if (response.success && response.filePath) {
      setState((prevState) => {
        const updatedTabs = [...prevState.tabs];
        updatedTabs[index].filePath = response.filePath;
        updatedTabs[index].title = getFileName(response.filePath!);
        updatedTabs[index].isSaved = true;
        return { ...prevState, tabs: updatedTabs };
      });
    } else {
      console.error(`Failed to save file as: ${response.error}`);
    }
  }, [tabs]);

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

  useEditorShortcuts({ saveTab, closeTab, activeIndex });

  useEffect(() => {
    // console.log('Saving state to localStorage:', state);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const activeTab = tabs[activeIndex];
    const textArea = textAreaRefs.current.get(activeTab?.id);
    if (textArea) {
      requestAnimationFrame(() => textArea.focus());
    }
  }, [activeIndex, tabs]);

  return {
    ...state,
    dialogOpen,
    tabListRef,
    textAreaRefs,
    handleScroll,
    setActiveIndex: (index: number) => setState((prevState) => ({ ...prevState, activeIndex: index })),
    addTab,
    closeTab,
    saveAsTab,
    confirmCloseTab,
    cancelCloseTab,
    updateTabContent,
    saveTab,
    openFile,
    setSpellCheckEnabled: (enabled: boolean) => setState((prevState) => ({ ...prevState, spellCheckEnabled: enabled })),
  };
};
