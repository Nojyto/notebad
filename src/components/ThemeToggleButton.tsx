import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-3 bg-accent text-accent-foreground rounded-full hover:scale-105 transition-transform"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </button>
  );
};

export default ThemeToggleButton;
