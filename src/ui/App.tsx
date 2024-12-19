import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // @ts-nocheck
    window.electron.subscribeStatistics((statistics) => console.log(statistics));
  }, []);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={reactLogo}
            alt="React logo"
            className="h-24 p-6 transition filter duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] logo react:hover:drop-shadow-[0_0_2em_#61dafbaa]"
          />
        </a>
      </div>
      <h1 className="text-4xl font-bold leading-tight text-center">Vi + React</h1>
      <div className="card p-8 mx-auto text-center">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 text-lg font-medium text-white bg-gray-800 border rounded-lg hover:border-customButtonHover transition duration-200"
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-500">
          Edit <code className="font-mono text-sm text-gray-400">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-8 text-gray-400 text-center read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
