import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const badges = [
  'badge-dayone.png',
  'badge-builder.png',
  'badge-explorer.png',
  'badge-star.png',
  'badge-icecore.png'
];

const holdingsOptions = [
  { id: 'total', label: 'Total Holdings', icon: '💰' },
  { id: 'staked', label: 'Staked', icon: '🔒' },
  { id: 'locked', label: 'Locked', icon: '🪙' },
  { id: 'platform', label: 'Platform Total', icon: '📊' },
  { id: 'value', label: 'Portfolio Value', icon: '💎' }
];

interface BadgeHoldingsPanelProps {
  activeBadges: string[];
  setActiveBadges: React.Dispatch<React.SetStateAction<string[]>>;
  showFields: string[];
  setShowFields: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function BadgeHoldingsPanel({ activeBadges, setActiveBadges, showFields, setShowFields }: BadgeHoldingsPanelProps) {
  const [showHoldings, setShowHoldings] = useState(true);

  const toggleBadge = (badge: string) => {
    setActiveBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 px-4">
      {/* Badges + Holdings Overlay Section */}
      <div className="bg-[#11131d] border border-neutral-800 rounded-xl p-4 w-full shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Badges + Holdings Display</h3>
          <button
            onClick={() => setShowHoldings(!showHoldings)}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            {showHoldings ? 'Hide Holdings' : 'Show Holdings'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {badges.map((badge) => (
            <div
              key={badge}
              onClick={() => toggleBadge(badge)}
              className={cn(
                'cursor-pointer border-2 p-1 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:shadow-emerald-400/30',
                activeBadges.includes(badge)
                  ? 'border-emerald-500 bg-emerald-900'
                  : 'border-neutral-700'
              )}
            >
              <Image src={`/images/badges/${badge}`} alt={badge} width={32} height={32} />
            </div>
          ))}
        </div>

        {showHoldings && (
          <div className="mt-4 transition-all duration-500 ease-in-out">
            <h4 className="text-xs text-neutral-400 mb-2">Holdings Display Options</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {holdingsOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-neutral-900 shadow-inner"
                >
                  <span className="text-sm text-white flex items-center gap-2">
                    <span>{option.icon}</span>
                    {option.label}
                  </span>
                  <Switch
                    checked={showFields.includes(option.id)}
                    onCheckedChange={() => {
                      setShowFields((prev) =>
                        prev.includes(option.id)
                          ? prev.filter((id) => id !== option.id)
                          : [...prev, option.id]
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 