import { useEffect } from 'react';

interface EditorShortcutsProps {
  saveTab: (index: number) => void;
  closeTab: (index: number) => void;
  activeIndex: number;
}

export const useEditorShortcuts = ({ saveTab, closeTab, activeIndex }: EditorShortcutsProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveTab(activeIndex);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        closeTab(activeIndex);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeIndex, saveTab, closeTab]);
};
