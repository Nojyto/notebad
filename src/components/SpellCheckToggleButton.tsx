import { Check, SpellCheck2, X } from 'lucide-react';
import { useState } from 'react';
import { BsSpellcheck } from 'react-icons/bs';
import { FaSpellCheck } from 'react-icons/fa';

interface SpellCheckToggleButtonProps {
  size?: 'small' | 'default';
  onToggleSpellCheck: (enabled: boolean) => void;
}

const SpellCheckToggleButton = ({ size = 'default', onToggleSpellCheck }: SpellCheckToggleButtonProps) => {
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(false);

  const handleToggle = () => {
    const newStatus = !spellCheckEnabled;
    setSpellCheckEnabled(newStatus);
    onToggleSpellCheck(newStatus);
  };

  const iconSize = size === 'small' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <button
      onClick={handleToggle}
      className={`p-1 bg-accent text-accent-foreground rounded-full hover:scale-105 transition-transform ${iconSize}`}
      aria-label="Toggle Spellcheck"
      title={`Spellcheck ${spellCheckEnabled ? 'enabled' : 'disabled'}`}
    >
      {spellCheckEnabled ? (
        <SpellCheck2 className="w-full h-full text-green-500" />
      ) : (
        <SpellCheck2 className="w-full h-full text-red-500" />
      )}
    </button>
  );
};

export default SpellCheckToggleButton;
