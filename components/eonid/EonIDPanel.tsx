import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Holdings {
  total: string;
  staked: string;
  locked: string;
  platformTotal: string;
  valueUSD: string;
  change24h: string;
}

interface EonIDPanelProps {
  username: string;
  title: string;
  domain: string;
  xpLevel: number;
  theme?: string;
  badges?: string[];
  showHoldings?: boolean;
  holdings?: Holdings;
  referralUrl?: string;
  avatar?: string;
}

export default function EonIDPanel({
  username,
  title,
  domain,
  xpLevel,
  theme,
  badges = [],
  showHoldings = false,
  holdings,
  referralUrl,
  avatar
}: EonIDPanelProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyReferral = async () => {
    if (referralUrl) {
      try {
        await navigator.clipboard.writeText(referralUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy referral link:', err);
      }
    }
  };

  return (
    <div className="rounded-xl border border-neutral-700 bg-[#0b0c1a] text-white p-4 shadow-xl">
      <div className="flex items-start gap-6">
        {/* Avatar & Domain */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {avatar ? (
              <Image
                src={avatar}
                alt="avatar"
                width={90}
                height={90}
                className="rounded-full border-2 border-violet-500 object-cover"
              />
            ) : (
              <div className="w-[90px] h-[90px] rounded-full border-2 border-violet-500 bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-2xl">
                👤
              </div>
            )}
          </div>
          <p className="mt-1 text-sm font-mono text-violet-300">{domain || 'unclaimed'}.sol</p>
        </div>

        {/* Identity Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold leading-tight">{username || 'Anonymous'}</h1>
          <h2 className="text-lg text-muted-foreground -mt-1">{title || 'Builder'}</h2>

          {/* Badges */}
          {badges && badges.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              {badges.map((badge, index) => (
                <div key={index} className="relative">
                  <Image
                    src={`/badges/${badge}`}
                    alt={badge}
                    width={32}
                    height={32}
                    className="rounded border border-white/20"
                    onError={(e) => {
                      // Fallback for missing badge images
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* XP Progress */}
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide mb-1 text-gray-400">XP Progress</p>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((xpLevel / 1000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 text-gray-300">
              {xpLevel} / 1000 XP ({((xpLevel / 1000) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>

        {/* Holdings */}
        {showHoldings && holdings && (
          <div className="w-64 bg-black/30 p-3 rounded-xl text-sm border border-neutral-700">
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Total Holdings</span>
              <span className="text-yellow-400 font-bold">{holdings.total} EONIC</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Staked</span>
              <span className="text-cyan-400">{holdings.staked}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Locked</span>
              <span className="text-green-400">{holdings.locked}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Platform Total</span>
              <span className="text-pink-400">{holdings.platformTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Portfolio Value</span>
              <span className="text-emerald-400">
                ${holdings.valueUSD} ({holdings.change24h})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Referral Link */}
      {referralUrl && (
        <div className="mt-4 text-right">
          <Button 
            variant="outline" 
            onClick={handleCopyReferral}
            className="transition-all duration-200 hover:bg-violet-600/20 hover:border-violet-500"
          >
            {copySuccess ? '✅ Copied!' : 'Copy Referral Link'}
          </Button>
        </div>
      )}
    </div>
  );
} 