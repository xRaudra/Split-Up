import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import { displayName } from '../data/appState';

export default function SettlementRow({ from, to, currentUser, amount, status, onMarkPaid }) {
  const isPending = status === 'pending';
  return (
    <div className="flex items-center gap-2 px-4 py-3.5 rounded-[10px] bg-white" style={{ border: '1px solid #E5E7EB' }}>
      <Avatar name={from} size={32} />
      <span className="font-semibold text-sm text-[#111827]">{displayName(from, currentUser)}</span>
      <span className="text-[#9CA3AF] text-sm">→</span>
      <Avatar name={to} size={32} />
      <span className="flex-1 font-semibold text-sm text-[#111827] truncate">{displayName(to, currentUser)}</span>
      <span className="font-semibold text-[15px] text-[#111827]">₹{amount.toLocaleString('en-IN')}</span>
      {isPending && onMarkPaid ? (
        <button onClick={onMarkPaid} className="text-xs font-semibold text-[#4F46E5] px-2 shrink-0">Mark Paid</button>
      ) : (
        <StatusBadge type={status} />
      )}
    </div>
  );
}
