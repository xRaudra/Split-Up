import { useState } from 'react';
import { Plus } from 'lucide-react';
import TopBar from '../components/TopBar';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import SettlementRow from '../components/SettlementRow';
import Button from '../components/Button';
import BottomSheet from '../components/BottomSheet';
import { settlementsForTab, displayName } from '../data/appState';

const MAX_SUGGESTIONS = 5;

export default function TabDetailScreen({ tab, currentUser, knownPeople, onNavigate, onMarkPaid, onAddParticipant }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');

  if (!tab) return null;
  const settlements = settlementsForTab(tab);

  const suggestions = knownPeople
    .filter((p) => !tab.participants.some((existing) => existing.toLowerCase() === p.toLowerCase()))
    .slice(0, MAX_SUGGESTIONS);

  function addPerson(rawName) {
    const name = rawName.trim();
    if (!name) return;
    onAddParticipant(tab.id, name);
    setNameInput('');
  }

  function handleAddBill() {
    setSheetOpen(false);
    onNavigate('addBill', { tabId: tab.id });
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title={tab.name} onBack={() => onNavigate('tabs', { view: tab.standalone ? 'bills' : 'tabs' })} />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-8 screen-enter">
        <div className="flex items-center justify-between mt-1 mb-5">
          <button onClick={() => setSheetOpen(true)} className="flex items-center -space-x-2">
            {tab.participants.map((p) => (
              <div key={p} style={{ boxShadow: '0 0 0 2px #F8FAFC', borderRadius: 999 }}>
                <Avatar name={p} size={32} />
              </div>
            ))}
            {!tab.settled && (
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 32, height: 32, background: '#EEF2FF', border: '2px solid #F8FAFC' }}
                aria-label="Manage this split"
              >
                <Plus size={16} color="#4F46E5" />
              </div>
            )}
          </button>
          <StatusBadge type={tab.settled ? 'settled' : 'active'} />
        </div>

        <div className="flex flex-col items-center justify-center gap-1 py-6 rounded-2xl mb-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <span className="text-xs text-[#6B7280] uppercase tracking-wide font-semibold">Split total</span>
          <span className="font-bold text-[28px] text-[#111827]">₹{tab.total.toLocaleString('en-IN')}</span>
        </div>

        {settlements.length > 0 && (
          <>
            <span className="block font-semibold text-[13px] text-[#6B7280] uppercase tracking-wide mb-2">
              {tab.settled ? 'Settlement' : 'Who owes what'}
            </span>
            <div className="flex flex-col gap-2 mb-5">
              {settlements.map((s) => (
                <SettlementRow
                  key={`${s.from}-${s.to}`}
                  from={s.from}
                  to={s.to}
                  currentUser={currentUser}
                  amount={s.amount}
                  status={s.status}
                  onMarkPaid={!tab.settled ? () => onMarkPaid(tab.id, s.from, s.to) : undefined}
                />
              ))}
            </div>
          </>
        )}

        <span className="block font-semibold text-[13px] text-[#6B7280] uppercase tracking-wide mb-2">Bills</span>
        <div className="flex flex-col gap-2">
          {tab.bills.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-4 py-3 rounded-[10px] bg-white" style={{ border: '1px solid #E5E7EB' }}>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-[#111827]">{b.name}</span>
                <span className="text-xs text-[#6B7280]">Paid by {displayName(b.paidBy, currentUser)} · {b.method === 'items' ? 'By items' : b.method === 'equally' ? 'Equally' : 'Custom'}</span>
              </div>
              <span className="font-semibold text-sm text-[#111827]">₹{b.total.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Manage Split">
        {!tab.settled && (
          <Button variant="primary" className="w-full" onClick={handleAddBill}>
            + Add Bill to this Split
          </Button>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Members</span>
          <div className="flex flex-col gap-2">
            {tab.participants.map((p) => (
              <div key={p} className="flex items-center gap-3 px-3 py-2 rounded-[10px]" style={{ background: '#F4F5F7' }}>
                <Avatar name={p} size={32} />
                <span className="text-sm font-semibold text-[#111827]">{displayName(p, currentUser)}</span>
              </div>
            ))}
          </div>
        </div>

        {!tab.settled && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Add Someone New</span>
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPerson(nameInput); } }}
                placeholder="Add a person by name"
                className="flex-1 h-11 px-4 rounded-[10px] text-sm font-medium text-[#111827] bg-white outline-none placeholder:text-[#9CA3AF] placeholder:font-normal border-[1.5px] border-[#E5E7EB] focus:border-[#4F46E5] transition-colors"
              />
              <button
                onClick={() => addPerson(nameInput)}
                disabled={!nameInput.trim()}
                className="h-11 px-4 rounded-[10px] text-sm font-semibold disabled:opacity-40"
                style={{ background: '#EEF2FF', color: '#4F46E5' }}
              >
                Add
              </button>
            </div>
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((p) => (
                  <button
                    key={p}
                    onClick={() => addPerson(p)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: '#F4F5F7', color: '#6B7280' }}
                  >
                    + {p}
                  </button>
                ))}
              </div>
            )}
            <span className="text-xs" style={{ color: '#9CA3AF' }}>
              They'll only owe a share of bills added from now on — nothing from before they joined.
            </span>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
