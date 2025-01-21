import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface SearchBarProps {
  isVisible: boolean;
  content: string;
  onHighlight: (index: number, length: number) => void;
  onClose: () => void;
}

const SearchBar = ({ isVisible, content, onHighlight, onClose }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [matchIndices, setMatchIndices] = useState<{ index: number; length: number }[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number | null>(null);

  const handleSearch = useCallback((query: string) => {
    setQuery(query);
    const indices: { index: number; length: number }[] = [];
    if (query) {
      const regex = new RegExp(query, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        indices.push({ index: match.index, length: match[0].length });
      }
    }
    setMatchIndices(indices);
    setCurrentMatchIndex(null);
  }, [content]);

  useEffect(() => {
    if (query) handleSearch(query);
  }, [content, handleSearch, query]);

  const navigateToMatch = (direction: 'next' | 'prev') => {
    if (matchIndices.length === 0) return;

    setCurrentMatchIndex((prevIndex) => {
      const newIndex =
        direction === 'next'
          ? prevIndex === null
            ? 0
            : (prevIndex + 1) % matchIndices.length
          : prevIndex === null
            ? matchIndices.length - 1
            : (prevIndex - 1 + matchIndices.length) % matchIndices.length;

      const { index, length } = matchIndices[newIndex];
      onHighlight(index, length);
      return newIndex;
    });
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-1 right-2 bg-secondary text-secondary-foreground rounded-md shadow p-1 flex items-center space-x-0.5 z-10">
      <div className='w-44 flex items-center space-x-2'>
        <input
          type="text"
          id="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search..."
          className="w-32 px-1 py-0.5 border-none rounded-sm focus:outline-none text-sm"
        />
        <span className="text-sm">
          {matchIndices.length > 0
            ? `${currentMatchIndex !== null ? currentMatchIndex + 1 : 0}/${matchIndices.length}`
            : '0/0'}
        </span>
      </div>
      <button
        onClick={() => navigateToMatch('prev')}
        className="text-secondary-foreground hover:text-primary"
        aria-label="Previous Match"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => navigateToMatch('next')}
        className="text-secondary-foreground hover:text-primary"
        aria-label="Next Match"
      >
        <ChevronRight />
      </button>
      <button
        onClick={onClose}
        className="pr-1 text-destructive hover:text-destructive-foreground"
        aria-label="Close Search"
      >
        ✕
      </button>
    </div>
  );
};

export default SearchBar;
