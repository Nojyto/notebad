import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleButtonProps {
  size?: 'small' | 'default';
}

const ThemeToggleButton = ({ size = 'default' }: ThemeToggleButtonProps) => {
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const iconSize = size === 'small' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`p-1 bg-accent text-accent-foreground rounded-full hover:scale-105 transition-transform ${iconSize}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-full h-full" /> : <Moon className="w-full h-full" />}
    </button>
  );
};

export default ThemeToggleButton;
