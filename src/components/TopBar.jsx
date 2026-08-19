import { ChevronLeft } from 'lucide-react';

export default function TopBar({ title, onBack, action }) {
  return (
    <div className="flex items-center gap-2 px-3 pt-4 pb-3 shrink-0" style={{ background: '#F8FAFC' }}>
      {onBack ? (
        <button onClick={onBack} className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36 }} aria-label="Back">
          <ChevronLeft size={22} color="#111827" />
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
      <span className="flex-1 text-center font-semibold text-[16px] text-[#111827] truncate">{title}</span>
      <div style={{ width: 36 }} className="flex items-center justify-center">{action}</div>
    </div>
  );
}
