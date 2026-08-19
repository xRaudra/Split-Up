import { Sparkle } from 'lucide-react';

const sparkles = [
  { size: 22, top: '27%', left: '73%' },
  { size: 16, top: '-8%', left: '87%' },
  { size: 18, top: '4%', left: '63%' },
  { size: 26, top: '53%', left: '84%' },
  { size: 20, top: '50%', left: '63%' },
];

export default function SummaryCard({ value, badge, badgeColor = '#16A34A' }) {
  return (
    <div
      className="relative overflow-hidden rounded-[10px]"
      style={{ background: '#F8FAFC', border: '1px solid #4F46E5', padding: '15px 20px' }}
    >
      {sparkles.map((s, i) => (
        <Sparkle
          key={i}
          size={s.size}
          fill="#E2E8F0"
          color="#E2E8F0"
          style={{ position: 'absolute', top: s.top, left: s.left }}
          aria-hidden="true"
        />
      ))}

      <div className="relative flex flex-col" style={{ gap: 18, maxWidth: 220 }}>
        <span className="text-[#111827]" style={{ fontSize: 10, textTransform: 'uppercase' }}>
          Your Split at Glance
        </span>
        <div className="flex flex-col" style={{ gap: 6 }}>
          <span className="font-bold" style={{ fontSize: 42, lineHeight: 1.2, color: '#4F46E5' }}>
            {value}
          </span>
          <span className="text-right" style={{ fontSize: 12, color: badgeColor }}>
            {badge}
          </span>
        </div>
      </div>
    </div>
  );
}
