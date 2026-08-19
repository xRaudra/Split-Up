export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{label}</span>}
      <input
        className="h-12 px-4 rounded-[10px] text-[15px] font-semibold text-[#111827] outline-none placeholder:text-[#9CA3AF] placeholder:font-normal"
        style={{
          background: '#FFFFFF',
          border: `1.5px solid ${error ? '#DC2626' : '#E5E7EB'}`,
        }}
        {...props}
      />
      {error && <span className="text-xs" style={{ color: '#DC2626' }}>{error}</span>}
    </div>
  );
}
