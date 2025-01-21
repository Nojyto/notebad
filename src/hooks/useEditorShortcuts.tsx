import { useEffect } from 'react';

interface EditorShortcutsProps {
  saveTab: (index: number) => void;
  closeTab: (index: number) => void;
  activeIndex: number;
  setSearchVisible: (isVisible: boolean) => void;
}

export const useEditorShortcuts = ({ saveTab, closeTab, activeIndex, setSearchVisible }: EditorShortcutsProps) => {
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
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setSearchVisible(true);
        setTimeout(() => {
          (document.querySelector('#search') as HTMLInputElement)?.focus();
        }, 0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeIndex, saveTab, closeTab, setSearchVisible]);
};
