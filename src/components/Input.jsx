export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{label}</span>}
      <input
        className={`h-12 px-4 rounded-[10px] text-[15px] font-semibold text-[#111827] bg-white outline-none placeholder:text-[#9CA3AF] placeholder:font-normal border-[1.5px] transition-colors ${
          error ? 'border-[#DC2626]' : 'border-[#E5E7EB] focus:border-[#4F46E5]'
        }`}
        {...props}
      />
      {error && <span className="text-xs" style={{ color: '#DC2626' }}>{error}</span>}
    </div>
  );
}
