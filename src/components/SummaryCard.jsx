import summaryCardBg from '../assets/summary-card-bg.png';

export default function SummaryCard({ headline, sub }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 px-6 py-8 rounded-2xl text-center bg-cover bg-right"
      style={{ backgroundImage: `url(${summaryCardBg})`, backgroundColor: '#4F46E5' }}
    >
      <span className="font-bold text-[26px] leading-tight text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{headline}</span>
      {sub && <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{sub}</span>}
    </div>
  );
}
