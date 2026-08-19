export default function SummaryCard({ headline, sub, tone = 'neutral' }) {
  const tones = {
    neutral: { bg: '#EEF2FF', fg: '#3730A3' },
    positive: { bg: '#F0FDF4', fg: '#166534' },
    negative: { bg: '#FEF2F2', fg: '#991B1B' },
  };
  const t = tones[tone];
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-6 py-7 rounded-2xl text-center" style={{ background: t.bg }}>
      <span className="font-bold text-[26px] leading-tight" style={{ fontFamily: 'Poppins, sans-serif', color: t.fg }}>{headline}</span>
      {sub && <span className="text-sm text-[#6B7280]">{sub}</span>}
    </div>
  );
}
