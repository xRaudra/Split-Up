export default function SplitMethodSelector({ value, onChange, perHead }) {
  const options = [
    { key: 'equally', title: 'Equally', desc: perHead != null ? `Everyone pays the same amount · ₹${perHead.toLocaleString('en-IN')} each` : 'Everyone pays the same amount' },
    { key: 'custom', title: 'Custom', desc: 'Enter amounts manually, or split by items' },
  ];
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const selected = value === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className="flex flex-col gap-1.5 px-5 py-4 rounded-xl text-left transition-colors"
            style={{
              background: selected ? '#EEF2FF' : '#FFFFFF',
              border: `${selected ? 2 : 1}px solid ${selected ? '#4F46E5' : '#E5E7EB'}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[16px] text-[#111827]">{opt.title}</span>
              {selected && (
                <span className="flex items-center justify-center rounded-full" style={{ width: 20, height: 20, background: '#4F46E5' }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.3 4.5L3.4 6.5L7.6 1.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
            <span className="text-[13px] text-[#6B7280]">{opt.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
