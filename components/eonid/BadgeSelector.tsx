import Image from 'next/image';

interface BadgeSelectorProps {
  badges: string[];
  toggleBadge: (badge: string) => void;
}

export default function BadgeSelector({ badges, toggleBadge }: BadgeSelectorProps) {
  const badgeList = [
    'badge1.png',
    'badge2.png',
    'badge3.png',
    'badge4.png',
    'badge5.png',
    'badge6.png'
  ];

  return (
    <div className="grid grid-cols-3 gap-2 p-2 rounded-lg border border-neutral-700 bg-neutral-900 max-w-[150px]">
      {badgeList.map((badge) => {
        const isActive = badges.includes(badge);
        return (
          <div
            key={badge}
            onClick={() => toggleBadge(badge)}
            className={`cursor-pointer rounded-md p-1 border-2 transition-all ${
              isActive ? 'border-emerald-400 bg-emerald-900' : 'border-neutral-700'
            }`}
            title={badge.replace('.png', '')}
          >
            <Image
              src={`/badges/${badge}`}
              alt={badge}
              width={32}
              height={32}
              className="rounded"
            />
          </div>
        );
      })}
    </div>
  );
} 