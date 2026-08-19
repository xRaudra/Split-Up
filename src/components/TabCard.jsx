import StatusBadge from './StatusBadge';
import { tabTypeFor } from '../data/tabTypes';

export default function TabCard({ tab, onClick }) {
  const type = tabTypeFor(tab.type);
  return (
    <button
      onClick={onClick}
      className="w-full flex flex-col gap-2 px-5 py-4 rounded-xl text-left bg-white"
      style={{ border: '1px solid #E5E7EB' }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {type && <type.Icon size={15} color="#6B7280" className="shrink-0" />}
          <span className="font-semibold text-[16px] text-[#111827] truncate">{tab.name}</span>
        </div>
        <StatusBadge type={tab.settled ? 'settled' : 'active'} />
      </div>
      <span className="font-bold text-[20px] text-[#111827]">₹{tab.total.toLocaleString('en-IN')}</span>
      <span className="text-[13px] text-[#6B7280]">{tab.participants.length} people · {tab.settled ? 'Settled' : `Updated ${tab.updated}`}</span>
    </button>
  );
}
