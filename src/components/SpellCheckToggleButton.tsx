import { SpellCheck2 } from 'lucide-react';

interface SpellCheckToggleButtonProps {
  size?: 'small' | 'default';
  spellCheckEnabled: boolean;
  onToggleSpellCheck: () => void;
}

const SpellCheckToggleButton = ({ size = 'default', spellCheckEnabled, onToggleSpellCheck }: SpellCheckToggleButtonProps) => {
  const iconSize = size === 'small' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <button
      onClick={onToggleSpellCheck}
      className={`p-1 bg-accent text-accent-foreground rounded-full hover:scale-105 transition-transform ${iconSize}`}
      aria-label="Toggle Spellcheck"
      title={`Spellcheck ${spellCheckEnabled ? 'enabled' : 'disabled'}`}
    >
      <SpellCheck2 className={`w-full h-full ${spellCheckEnabled ? 'text-green-500' : 'text-red-500'}`} />
    </button>
  );
};

export default SpellCheckToggleButton;
