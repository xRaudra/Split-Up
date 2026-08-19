import summaryCardBg from '../assets/summary-card-bg.png';

export default function SummaryCard({ value, badge, badgeColor = '#16A34A' }) {
  return (
    <div
      className="rounded-[10px] bg-cover bg-right"
      style={{
        backgroundImage: `url(${summaryCardBg})`,
        backgroundColor: '#F8FAFC',
        border: '1px solid #4F46E5',
        padding: '15px 20px',
      }}
    >
      <div className="flex flex-col" style={{ gap: 18, maxWidth: 220 }}>
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
