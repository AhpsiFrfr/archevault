import { useState } from 'react';
import EonIDPanel from '@/components/eonid/EonIDPanel';
import { Button } from '@/components/ui/button';

export default function EonIDDemo() {
  const [showHoldings, setShowHoldings] = useState(true);

  // Sample data matching the image you provided
  const sampleData = {
    username: 'Bussynfrfr',
    title: 'King of The Rats',
    domain: 'bussynfrfr',
    xpLevel: 0,
    badges: ['badge1.png', 'badge2.png', 'badge3.png', 'badge4.png', 'badge5.png', 'badge6.png'],
    holdings: {
      total: '42,000',
      staked: '18,500',
      locked: '800,500',
      platformTotal: '54,298.75',
      valueUSD: '54,298.75',
      change24h: '+8.7%'
    },
    referralUrl: 'https://archevault.com/ref/bussynfrfr',
    avatar: '' // Will use fallback avatar
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
            EON-ID Panel Demo
          </h1>
          <p className="text-gray-400 mb-6">
            Preview of the new EON-ID display component
          </p>
          
          {/* Toggle Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={showHoldings ? 'default' : 'outline'}
              onClick={() => setShowHoldings(!showHoldings)}
            >
              {showHoldings ? 'Hide Holdings' : 'Show Holdings'}
            </Button>
          </div>
        </div>

        {/* EON-ID Panel Demo */}
        <div className="max-w-4xl mx-auto">
          <EonIDPanel
            username={sampleData.username}
            title={sampleData.title}
            domain={sampleData.domain}
            xpLevel={sampleData.xpLevel}
            badges={sampleData.badges}
            showHoldings={showHoldings}
            holdings={sampleData.holdings}
            referralUrl={sampleData.referralUrl}
            avatar={sampleData.avatar}
          />
        </div>

        {/* Component Info */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Component Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">✨ Features</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Avatar with fallback design</li>
                  <li>• Wallet domain display (.sol)</li>
                  <li>• Username and title</li>
                  <li>• Badge collection display</li>
                  <li>• XP progress bar with percentage</li>
                  <li>• Optional EONIC holdings block</li>
                  <li>• Referral link copy functionality</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🎨 Styling</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Dark theme with violet accents</li>
                  <li>• Gradient XP progress bar</li>
                  <li>• Color-coded holdings values</li>
                  <li>• Smooth hover animations</li>
                  <li>• Copy success feedback</li>
                  <li>• Error handling for missing images</li>
                  <li>• TypeScript interfaces</li>
                  <li>• Accessible design</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Usage Example</h2>
            <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
{`<EonIDPanel
  username="Bussynfrfr"
  title="King of The Rats"
  domain="bussynfrfr"
  xpLevel={0}
  badges={['badge1.png', 'badge2.png']}
  showHoldings={true}
  holdings={{
    total: '42,000',
    staked: '18,500',
    locked: '800,500',
    platformTotal: '54,298.75',
    valueUSD: '54,298.75',
    change24h: '+8.7%'
  }}
  referralUrl="https://archevault.com/ref/bussynfrfr"
  avatar="/path/to/avatar.png"
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 