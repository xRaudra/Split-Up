import { useState } from 'react';
import { Bell, HelpCircle, Shield, ChevronRight, Pencil, RotateCcw } from 'lucide-react';
import Avatar from '../components/Avatar';

const rows = [
  { icon: Bell, label: 'Notifications' },
  { icon: Shield, label: 'Privacy & Security' },
  { icon: HelpCircle, label: 'Help & FAQ' },
];

export default function ProfileScreen({ currentUser, onRename, onResetData }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(currentUser);

  function saveName() {
    const trimmed = draft.trim();
    if (trimmed) onRename(trimmed);
    else setDraft(currentUser);
    setEditing(false);
  }

  function handleReset() {
    if (window.confirm('Clear every tab and bill from this session? This can\'t be undone.')) {
      onResetData();
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto hide-scrollbar screen-enter" style={{ background: '#F8FAFC' }}>
      <div className="flex flex-col items-center gap-3 px-5 pt-8 pb-5">
        <Avatar name={currentUser} size={72} />

        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
            className="text-center font-semibold text-[18px] text-[#111827] outline-none border-b-2 pb-0.5"
            style={{ borderColor: '#4F46E5' }}
          />
        ) : (
          <button onClick={() => { setDraft(currentUser); setEditing(true); }} className="flex items-center gap-1.5">
            <span className="font-semibold text-[18px] text-[#111827]">{currentUser}</span>
            <Pencil size={14} color="#9CA3AF" />
          </button>
        )}
        <span className="text-xs" style={{ color: '#9CA3AF' }}>Local session only — no account needed</span>
      </div>

      <div className="px-5 flex flex-col gap-2">
        {rows.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-3 px-4 py-3.5 rounded-[10px] bg-white text-left"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <Icon size={18} color="#6B7280" />
            <span className="flex-1 text-sm font-semibold text-[#111827]">{label}</span>
            <ChevronRight size={16} color="#9CA3AF" />
          </button>
        ))}

        <button
          onClick={handleReset}
          className="flex items-center gap-3 px-4 py-3.5 rounded-[10px] bg-white text-left mt-2"
          style={{ border: '1px solid #E5E7EB' }}
        >
          <RotateCcw size={18} color="#DC2626" />
          <span className="flex-1 text-sm font-semibold" style={{ color: '#DC2626' }}>Reset All Data</span>
        </button>
      </div>

      <span className="text-center text-xs text-[#9CA3AF] mt-5 mb-6 px-5 leading-snug">
        Split Up runs entirely on this device. Closing the tab clears everything — nothing is stored or sent anywhere.
      </span>
    </div>
  );
}
