import summaryCardBg from '../assets/summary-card-bg.png';

export default function SummaryCard({ value, badge, badgeColor = '#16A34A' }) {
  return (
    <div
      className="rounded-[10px] bg-cover bg-right"
      style={{ backgroundImage: `url(${summaryCardBg})`, backgroundColor: '#4F46E5', padding: '15px 20px' }}
    >
      <div className="flex flex-col" style={{ gap: 18, maxWidth: 200 }}>
        <span className="text-white" style={{ fontSize: 10, textTransform: 'uppercase' }}>
          Your Split at Glance
        </span>
        <span className="text-white font-bold" style={{ fontSize: 30, lineHeight: 1.2 }}>
          {value}
        </span>
        <span
          className="self-start"
          style={{ background: '#F8FAFC', color: badgeColor, fontSize: 8, borderRadius: 4, padding: 6 }}
        >
          {badge}
        </span>
      </div>
    </div>
  );
}
