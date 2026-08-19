export default function EmptyState({ title, body, ctaLabel, onCta }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-8 py-12 rounded-xl text-center" style={{ background: '#F4F5F7' }}>
      <span className="font-semibold text-[17px] text-[#111827]">{title}</span>
      <span className="text-[13px] text-[#6B7280]">{body}</span>
      {ctaLabel && (
        <button onClick={onCta} className="mt-1 h-10 px-5 rounded-[10px] font-semibold text-sm text-white" style={{ background: '#4F46E5' }}>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
