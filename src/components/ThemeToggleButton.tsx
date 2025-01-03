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

  const handleThemeToggle = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <button
      onClick={handleThemeToggle}
      className="p-3 bg-accent text-accent-foreground rounded-full shadow-lg hover:scale-105 transition-transform"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Moon className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
