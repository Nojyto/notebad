import { ChevronDown, ChevronLeft, ChevronRight, Replace, ReplaceAll } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface SearchBarProps {
  isVisible: boolean;
  content: string;
  onHighlight: (index: number, length: number) => void;
  onContentReplace?: (updatedContent: string) => void;
  onClose: () => void;
}

const SearchBar = ({ isVisible, content, onHighlight, onContentReplace = () => { }, onClose }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchIndices, setMatchIndices] = useState<{ index: number; length: number }[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number | null>(null);
  const [showReplace, setShowReplace] = useState(false);

  const handleSearch = useCallback(() => {
    if (!query.trim() || !content.trim()) {
      setMatchIndices([]);
      setCurrentMatchIndex(null);
      return;
    }

    const indices: { index: number; length: number }[] = [];
    const regex = new RegExp(query, 'gi');
    let match;
    while ((match = regex.exec(content)) !== null) {
      indices.push({ index: match.index, length: match[0].length });
    }

    setMatchIndices(indices);

    setCurrentMatchIndex((prevIndex) => {
      if (prevIndex !== null && prevIndex < indices.length) {
        return prevIndex;
      }
      return indices.length > 0 ? 0 : null;
    });

    if (indices.length > 0 && currentMatchIndex === null) {
      const { index, length } = indices[0];
      onHighlight(index, length);
    }
  }, [content, query, onHighlight]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [handleSearch, query]);

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

  const replaceCurrentMatch = () => {
    if (currentMatchIndex === null || matchIndices.length === 0) return;

    const { index, length } = matchIndices[currentMatchIndex];
    const before = content.slice(0, index);
    const after = content.slice(index + length);
    const updatedContent = before + replaceText + after;

    onContentReplace(updatedContent);
    handleSearch();
  };

  const replaceAllMatches = () => {
    if (!query.trim()) return;

    const regex = new RegExp(query, 'gi');
    const updatedContent = content.replace(regex, replaceText);
    onContentReplace(updatedContent);
    setQuery('');
    setReplaceText('');
    setMatchIndices([]);
    setCurrentMatchIndex(null);
  };

  useEffect(() => {
    if (!isVisible) {
      setQuery('');
      setReplaceText('');
      setMatchIndices([]);
      setCurrentMatchIndex(null);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute top-1 right-2 bg-secondary text-secondary-foreground rounded-md shadow p-1 flex flex-col space-y-1 z-10">
      <div className="flex items-center space-x-1">
        <input
          type="text"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-32 px-1 py-0.5 border border-border rounded text-xs"
        />
        <span className="text-xs">{currentMatchIndex !== null ? `${currentMatchIndex + 1}/${matchIndices.length}` : '0/0'}</span>
        <button
          onClick={() => navigateToMatch('prev')}
          className="p-1 text-secondary-foreground hover:text-primary bg-secondary rounded"
          aria-label="Previous Match"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => navigateToMatch('next')}
          className="p-1 text-secondary-foreground hover:text-primary bg-secondary rounded"
          aria-label="Next Match"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => setShowReplace(!showReplace)}
          className={`p-1 text-secondary-foreground hover:text-primary bg-secondary rounded transition-transform ${showReplace ? 'rotate-180' : ''
            }`}
          aria-label="Show Replace"
        >
          <ChevronDown size={16} />
        </button>
        <button
          onClick={onClose}
          className="p-1 text-destructive hover:text-destructive-foreground bg-secondary rounded"
          aria-label="Close Search"
        >
          ✕
        </button>
      </div>

      {showReplace && (
        <div className="flex items-center space-x-1 mt-1">
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace with..."
            className="w-32 px-1 py-0.5 border border-border rounded text-xs"
          />
          <button
            onClick={replaceCurrentMatch}
            className="p-1 text-secondary-foreground hover:text-primary bg-secondary rounded"
            aria-label="Replace Current Match"
          >
            <Replace size={16} />
          </button>
          <button
            onClick={replaceAllMatches}
            className="p-1 text-secondary-foreground hover:text-primary bg-secondary rounded"
            aria-label="Replace All Matches"
          >
            <ReplaceAll size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
