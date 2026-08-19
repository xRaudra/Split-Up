import TopBar from '../components/TopBar';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import SettlementRow from '../components/SettlementRow';
import Button from '../components/Button';
import { settlementsForTab } from '../data/mockData';

export default function TabDetailScreen({ tab, onNavigate, onMarkPaid }) {
  if (!tab) return null;
  const settlements = settlementsForTab(tab);

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title={tab.name} onBack={() => onNavigate('tabs')} />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-8 screen-enter">
        <div className="flex items-center justify-between mt-1 mb-4">
          <div className="flex -space-x-2">
            {tab.participants.map((p) => (
              <div key={p} style={{ boxShadow: '0 0 0 2px #F8FAFC', borderRadius: 999 }}>
                <Avatar name={p} size={32} />
              </div>
            ))}
          </div>
          <StatusBadge type={tab.settled ? 'settled' : 'active'} />
        </div>

        <div className="flex flex-col items-center justify-center gap-1 py-6 rounded-2xl mb-6" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <span className="text-xs text-[#6B7280] uppercase tracking-wide font-semibold">Tab total</span>
          <span className="font-bold text-[28px] text-[#111827]">₹{tab.total.toLocaleString('en-IN')}</span>
        </div>

        <span className="block font-semibold text-[13px] text-[#6B7280] uppercase tracking-wide mb-2">
          {tab.settled ? 'Settlement' : 'Who owes what'}
        </span>
        <div className="flex flex-col gap-2 mb-6">
          {settlements.map((s) => (
            <SettlementRow
              key={s.from}
              from={s.from}
              to={s.to}
              amount={s.amount}
              status={s.status}
              onMarkPaid={!tab.settled ? () => onMarkPaid(tab.id, s.from) : undefined}
            />
          ))}
        </div>

        <span className="block font-semibold text-[13px] text-[#6B7280] uppercase tracking-wide mb-2">Bills</span>
        <div className="flex flex-col gap-2">
          {tab.bills.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-4 py-3 rounded-[10px] bg-white" style={{ border: '1px solid #E5E7EB' }}>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-[#111827]">{b.name}</span>
                <span className="text-xs text-[#6B7280]">Paid by {b.paidBy.split(' ')[0]} · {b.method === 'items' ? 'By items' : b.method === 'equally' ? 'Equally' : 'Custom'}</span>
              </div>
              <span className="font-semibold text-sm text-[#111827]">₹{b.total.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        {!tab.settled && (
          <Button
            variant="secondary"
            className="w-full mt-6"
            onClick={() => onNavigate('addBill', { tabId: tab.id })}
          >
            + Add Bill to this Tab
          </Button>
        )}
      </div>
    </div>
  );
}
