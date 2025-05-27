import { useState } from 'react';
// Simple toggle component to replace Switch
const Toggle = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <button
    onClick={() => onCheckedChange(!checked)}
    aria-label={`Toggle ${checked ? 'off' : 'on'}`}
    className={cn(
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
      checked ? 'bg-blue-600' : 'bg-gray-600'
    )}
  >
    <span
      className={cn(
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
        checked ? 'translate-x-6' : 'translate-x-1'
      )}
    />
  </button>
);
import { cn } from '@/lib/utils';
import Image from 'next/image';

const badges = [
  'badge1.png',
  'badge2.png',
  'badge3.png',
  'badge4.png',
  'badge5.png',
  'badge6.png'
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
    <div className="bg-[#0d0f1a] border border-neutral-800 rounded-2xl p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">🎖️ Badges + Holdings Display</h3>
        <button
          onClick={() => setShowHoldings(!showHoldings)}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showHoldings ? 'Hide Holdings' : 'Show Holdings'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Badge Section */}
        <div>
          <h4 className="text-sm font-semibold text-neutral-300 mb-2">Badge Collection</h4>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <div
                key={badge}
                onClick={() => toggleBadge(badge)}
                className={cn(
                  'cursor-pointer border-2 p-1 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-400/30',
                  activeBadges.includes(badge)
                    ? 'border-emerald-500 bg-emerald-900'
                    : 'border-neutral-700'
                )}
              >
                <Image src={`/images/badges/${badge}`} alt={badge} width={40} height={40} />
              </div>
            ))}
          </div>
        </div>

        {/* Holdings Section */}
        <div
          className={cn(
            'transition-all duration-500 ease-in-out overflow-hidden',
            showHoldings ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <h4 className="text-sm font-semibold text-neutral-300 mb-2">Holdings Display Options</h4>
          <div className="space-y-2">
            {holdingsOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between bg-neutral-900 px-3 py-2 rounded-lg">
                <span className="text-sm text-white">
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </span>
                <Toggle
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
      </div>
    </div>
  );
} 