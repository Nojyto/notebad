import { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="h-screen bg-background text-text flex flex-col items-center justify-center p-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-primary">Simplistic Note</h1>
        <p className="text-secondary mt-2">A clean and simple experience</p>
      </header>

      <main className="flex flex-col items-center w-full max-w-lg">
        <button
          onClick={toggleTheme}
          className="w-full py-3 mb-4 text-lg font-medium bg-primary text-white rounded hover:bg-accent transition"
        >
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>

        <div className="text-center w-full mb-6">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="w-full py-3 text-lg font-medium bg-secondary text-white rounded hover:bg-accent transition"
          >
            Count is {count}
          </button>
        </div>

        <p className="text-center text-secondary">
          Edit <code className="font-mono text-accent">App.tsx</code> and save to test HMR.
        </p>
      </main>

      <footer className="mt-auto text-center">
        <p className="text-sm text-secondary">
          Made with ❤️ using React & TailwindCSS
        </p>
      </footer>
    </div>
  );
}

export default App;
