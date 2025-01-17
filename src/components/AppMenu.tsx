import { Maximize2, Minus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import BrandIcon from "../assets/desktop-icon.svg";
import SpellCheckToggleButton from './SpellCheckToggleButton';
import ThemeToggleButton from './ThemeToggleButton';

interface AppMenuProps {
  handleMenuClick: (menuItem: string) => void;
  spellCheckEnabled: boolean;
  onToggleSpellCheck: () => void;
}

const AppMenu = ({ handleMenuClick, spellCheckEnabled, onToggleSpellCheck }: AppMenuProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMenuHover = (menu: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setActiveMenu(null);
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-2 py-1 bg-secondary text-secondary-foreground border-b border-border h-8 draggable">
      <div className="flex items-center space-x-2 undraggable">
        <img src={BrandIcon} alt="App Logo" className="w-auto h-6 mx-auto" draggable="false" />
        <div className="flex space-x-2">
          {['File'].map((menu) => (
            <div
              key={menu}
              className="group relative"
              onMouseEnter={() => handleMenuHover(menu)}
              onMouseLeave={handleMenuLeave}
            >
              <button className="text-[11px] font-medium hover:bg-accent rounded-md px-2 py-1">
                {menu}
              </button>
              {activeMenu === menu && (
                <div className="absolute top-full left-0 bg-secondary text-secondary-foreground rounded shadow-lg z-50 w-40 pointer-events-auto">
                  {menu === 'File' && (
                    <ul className="py-1 text-sm">
                      <li onClick={() => handleMenuClick('New File')} className="px-4 py-1 hover:bg-accent cursor-pointer">New File</li>
                      <li onClick={() => handleMenuClick('Open File')} className="px-4 py-1 hover:bg-accent cursor-pointer">Open File</li>
                      <li onClick={() => handleMenuClick('Save File')} className="px-4 py-1 hover:bg-accent cursor-pointer">Save File</li>
                      <li onClick={() => handleMenuClick('Save File As')} className="px-4 py-1 hover:bg-accent cursor-pointer">Save File As..</li>

                      <hr className="border-muted my-1" />
                      <li onClick={() => handleMenuClick('Close Tab')} className="px-4 py-1 hover:bg-accent cursor-pointer">Close Tab</li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-2 items-center undraggable">
        <SpellCheckToggleButton size="small" spellCheckEnabled={spellCheckEnabled} onToggleSpellCheck={onToggleSpellCheck} />
        <ThemeToggleButton size="small" />

        <button onClick={() => window.ipcRenderer.send('minimize')} className="w-5 h-5 p-1">
          <Minus className="w-full h-full text-secondary-foreground" />
        </button>
        <button onClick={() => window.ipcRenderer.send('maximize')} className="w-5 h-5 p-1">
          <Maximize2 className="w-full h-full text-secondary-foreground" />
        </button>
        <button onClick={() => window.ipcRenderer.send('close')} className="w-5 h-5 p-1">
          <X className="w-full h-full text-red-500 hover:text-red-700" />
        </button>
      </div>
    </div>
  );
};

export default AppMenu;
