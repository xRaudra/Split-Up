import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar';
import Input from '../components/Input';
import AmountInput from '../components/AmountInput';
import ParticipantRow from '../components/ParticipantRow';
import SplitMethodSelector from '../components/SplitMethodSelector';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { currentUser, people } from '../data/mockData';

export default function AddBillManualScreen({ tabs, presetTabId, onNavigate, onSubmit }) {
  const activeTabs = tabs.filter((t) => !t.settled);
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');
  const [destTabId, setDestTabId] = useState(presetTabId || (activeTabs[0]?.id ?? '__new__'));
  const [newTabName, setNewTabName] = useState('');
  const [selected, setSelected] = useState(() => new Set([currentUser]));
  const [method, setMethod] = useState('equally');
  const [customShares, setCustomShares] = useState({});

  const amountNum = Number(amount) || 0;
  const selectedList = people.filter((p) => selected.has(p));
  const perHead = selectedList.length ? Math.round(amountNum / selectedList.length) : 0;

  const customTotal = useMemo(
    () => selectedList.reduce((sum, p) => sum + (Number(customShares[p]) || 0), 0),
    [customShares, selectedList]
  );
  const remainder = amountNum - customTotal;

  function toggle(person) {
    if (person === currentUser) return; // payer always included
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(person)) next.delete(person); else next.add(person);
      return next;
    });
  }

  const isNewTab = destTabId === '__new__';
  const canSubmit =
    billName.trim() &&
    amountNum > 0 &&
    selectedList.length > 0 &&
    (isNewTab ? newTabName.trim() : true) &&
    (method === 'equally' || remainder === 0);

  function handleSubmit() {
    const shares =
      method === 'equally'
        ? Object.fromEntries(selectedList.map((p) => [p, perHead]))
        : Object.fromEntries(selectedList.map((p) => [p, Number(customShares[p]) || 0]));

    const bill = {
      id: `bill-${Date.now()}`,
      name: billName.trim(),
      total: amountNum,
      paidBy: currentUser,
      method,
      shares,
    };

    onSubmit({
      destTabId: isNewTab ? null : destTabId,
      newTabName: isNewTab ? newTabName.trim() : null,
      participants: selectedList,
      bill,
    });
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title="Enter Bill" onBack={() => onNavigate('addBill', { tabId: presetTabId })} />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-8 flex flex-col gap-5 screen-enter">
        <Input label="Bill Name" placeholder="e.g. Dinner at Beach Shack" value={billName} onChange={(e) => setBillName(e.target.value)} />
        <AmountInput label="Amount" value={amount} onChange={setAmount} />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Add to</span>
          <div className="flex gap-2 flex-wrap">
            {activeTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setDestTabId(t.id)}
                className="px-3.5 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: destTabId === t.id ? '#4F46E5' : '#FFFFFF',
                  color: destTabId === t.id ? '#FFFFFF' : '#111827',
                  border: `1.5px solid ${destTabId === t.id ? '#4F46E5' : '#E5E7EB'}`,
                }}
              >
                {t.name}
              </button>
            ))}
            <button
              onClick={() => setDestTabId('__new__')}
              className="px-3.5 py-2 rounded-full text-sm font-semibold"
              style={{
                background: isNewTab ? '#4F46E5' : '#FFFFFF',
                color: isNewTab ? '#FFFFFF' : '#111827',
                border: `1.5px solid ${isNewTab ? '#4F46E5' : '#E5E7EB'}`,
              }}
            >
              + New Tab
            </button>
          </div>
          {isNewTab && (
            <Input className="mt-2" placeholder="New tab name" value={newTabName} onChange={(e) => setNewTabName(e.target.value)} />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Split Between</span>
          <div className="flex flex-col gap-2">
            {people.map((p) => (
              <ParticipantRow key={p} name={p} selected={selected.has(p)} onToggle={() => toggle(p)} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Split Method</span>
          <SplitMethodSelector value={method} onChange={setMethod} perHead={amountNum > 0 ? perHead : null} />
        </div>

        {method === 'custom' && (
          <div className="flex flex-col gap-2">
            {selectedList.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <span className="flex-1 text-sm font-semibold text-[#111827]">{p}</span>
                <div className="flex items-center gap-1 h-10 px-3 rounded-[10px]" style={{ background: '#FFFFFF', border: '1.5px solid #E5E7EB' }}>
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

        <Button variant="primary" className="w-full mt-2" disabled={!canSubmit} onClick={handleSubmit}>
          Add Bill
        </Button>
      </div>
    </div>
  );
}
