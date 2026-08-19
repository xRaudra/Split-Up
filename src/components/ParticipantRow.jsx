import Avatar from './Avatar';

export default function ParticipantRow({ name, amount, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-left transition-colors"
      style={{
        background: selected ? '#EEF2FF' : '#FFFFFF',
        border: `1.5px solid ${selected ? '#4F46E5' : '#E5E7EB'}`,
      }}
    >
      <Avatar name={name} size={36} />
      <span className="flex-1 font-semibold text-[15px] text-[#111827]">{name}</span>
      {amount != null && <span className="font-semibold text-[15px] text-[#111827]">₹{amount.toLocaleString('en-IN')}</span>}
      <span
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: 22, height: 22,
          background: selected ? '#4F46E5' : '#FFFFFF',
          border: selected ? 'none' : '1.5px solid #E5E7EB',
        }}
      >
        {selected && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L3.75 7.25L8.5 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}
