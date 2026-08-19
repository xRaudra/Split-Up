import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar';
import Avatar from '../components/Avatar';
import SplitMethodSelector from '../components/SplitMethodSelector';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { displayName } from '../data/appState';

export default function AddBillMethodScreen({
  currentUser, billName, amount, participants, newPeople, destTabId, newTabName, tabType, paidBy,
  presetTabId, restoreState, onNavigate, onSubmit,
}) {
  const [method, setMethod] = useState('equally');
  const [customShares, setCustomShares] = useState({});

  const amountNum = Number(amount) || 0;
  const perHead = participants.length ? Math.round(amountNum / participants.length) : 0;

  const customTotal = useMemo(
    () => participants.reduce((sum, p) => sum + (Number(customShares[p]) || 0), 0),
    [customShares, participants]
  );
  const remainder = amountNum - customTotal;
  const canSubmit = method === 'equally' || remainder === 0;

  function handleBack() {
    onNavigate('addBill', { tabId: presetTabId, restore: restoreState });
  }

  function handleSubmit() {
    const shares =
      method === 'equally'
        ? Object.fromEntries(participants.map((p) => [p, perHead]))
        : Object.fromEntries(participants.map((p) => [p, Number(customShares[p]) || 0]));

    const bill = {
      id: `bill-${Date.now()}`,
      name: billName,
      total: amountNum,
      paidBy,
      method,
      shares,
    };

    onSubmit({ destTabId, newTabName, tabType, participants, newPeople, bill });
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title="Make It Fair" onBack={handleBack} />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-8 flex flex-col gap-5 screen-enter">
        <div className="flex items-center justify-between px-4 py-3 rounded-[10px] bg-white" style={{ border: '1px solid #E5E7EB' }}>
          <span className="font-semibold text-sm text-[#111827] truncate">{billName}</span>
          <span className="font-semibold text-sm text-[#111827] shrink-0">₹{amountNum.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-[10px]" style={{ background: '#EEF2FF' }}>
          <Avatar name={paidBy} size={24} />
          <span className="text-sm" style={{ color: '#4F46E5' }}>
            <span className="font-semibold">{displayName(paidBy, currentUser)}</span> paid this bill
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Split Method</span>
          <SplitMethodSelector value={method} onChange={setMethod} perHead={amountNum > 0 ? perHead : null} />
        </div>

        {method === 'custom' && (
          <div className="flex flex-col gap-2">
            {participants.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <Avatar name={p} size={28} />
                <span className="flex-1 text-sm font-semibold text-[#111827]">{displayName(p, currentUser)}</span>
                <div className="flex items-center gap-1 h-10 px-3 rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] focus-within:border-[#4F46E5] transition-colors">
                  <span className="text-sm text-[#6B7280]">₹</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={customShares[p] ?? ''}
                    onChange={(e) => setCustomShares((prev) => ({ ...prev, [p]: e.target.value.replace(/[^0-9]/g, '') }))}
                    className="w-20 text-sm font-semibold text-[#111827] outline-none bg-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            {remainder !== 0 && amountNum > 0 && (
              <ErrorMessage
                headline={`₹${Math.abs(remainder).toLocaleString('en-IN')} ${remainder > 0 ? 'remaining' : 'over'}`}
                body={`Adjust the amounts so the split equals ₹${amountNum.toLocaleString('en-IN')}.`}
              />
            )}
          </div>
        )}

        <div className="flex-1" />

        <Button variant="primary" className="w-full" disabled={!canSubmit} onClick={handleSubmit}>
          Add Bill
        </Button>
      </div>
    </div>
  );
}
