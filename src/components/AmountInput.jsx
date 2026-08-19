export default function AmountInput({ label, error, helper, value, onChange, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{label}</span>}
      <div
        className="flex items-center gap-1 h-16 px-5 rounded-[10px]"
        style={{ background: '#FFFFFF', border: `2px solid ${error ? '#DC2626' : '#4F46E5'}` }}
      >
        <span className="font-bold text-[22px] text-[#111827]">₹</span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
          className="flex-1 font-bold text-[22px] text-[#111827] outline-none bg-transparent min-w-0"
          placeholder="0"
        />
      </div>
      {(error || helper) && (
        <span className="text-xs" style={{ color: error ? '#DC2626' : '#6B7280' }}>{error || helper}</span>
      )}
    </div>
  );
}
