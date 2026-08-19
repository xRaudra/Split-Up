import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import TopBar from '../components/TopBar';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import SplitMethodSelector from '../components/SplitMethodSelector';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';

export default function AddBillSplitScreen({ tabs, currentUser, knownPeople, billName, amount, presetTabId, onNavigate, onSubmit }) {
  const activeTabs = tabs.filter((t) => !t.settled);
  const initialDestTabId = presetTabId || (activeTabs[0]?.id ?? '__new__');
  const initialDestTab = tabs.find((t) => t.id === initialDestTabId);
  const [destTabId, setDestTabId] = useState(initialDestTabId);
  const [newTabName, setNewTabName] = useState('');
  const [otherParticipants, setOtherParticipants] = useState(
    () => (initialDestTab ? initialDestTab.participants.filter((p) => p !== currentUser) : [])
  );
  const [participantInput, setParticipantInput] = useState('');
  const [method, setMethod] = useState('equally');
  const [customShares, setCustomShares] = useState({});

  const selectedList = useMemo(() => [currentUser, ...otherParticipants], [currentUser, otherParticipants]);
  const amountNum = Number(amount) || 0;
  const perHead = selectedList.length ? Math.round(amountNum / selectedList.length) : 0;

  const customTotal = useMemo(
    () => selectedList.reduce((sum, p) => sum + (Number(customShares[p]) || 0), 0),
    [customShares, selectedList]
  );
  const remainder = amountNum - customTotal;

  function addParticipant(rawName) {
    const name = rawName.trim();
    if (!name) return;
    const exists =
      name.toLowerCase() === currentUser.toLowerCase() ||
      otherParticipants.some((p) => p.toLowerCase() === name.toLowerCase());
    if (!exists) setOtherParticipants((prev) => [...prev, name]);
    setParticipantInput('');
  }

  function removeParticipant(name) {
    setOtherParticipants((prev) => prev.filter((p) => p !== name));
  }

  const suggestions = knownPeople.filter(
    (p) => p !== currentUser && !otherParticipants.some((op) => op.toLowerCase() === p.toLowerCase())
  );

  const isNewTab = destTabId === '__new__';
  const canSubmit =
    otherParticipants.length > 0 &&
    (isNewTab ? newTabName.trim() : true) &&
    (method === 'equally' || remainder === 0);

  function handleSubmit() {
    const shares =
      method === 'equally'
        ? Object.fromEntries(selectedList.map((p) => [p, perHead]))
        : Object.fromEntries(selectedList.map((p) => [p, Number(customShares[p]) || 0]));

    const bill = {
      id: `bill-${Date.now()}`,
      name: billName,
      total: amountNum,
      paidBy: currentUser,
      method,
      shares,
    };

    onSubmit({
      destTabId: isNewTab ? null : destTabId,
      newTabName: isNewTab ? newTabName.trim() : null,
      participants: selectedList,
      newPeople: otherParticipants,
      bill,
    });
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar
        title="Split It"
        onBack={() => onNavigate('addBill', { tabId: presetTabId, billName, amount })}
      />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-8 flex flex-col gap-5 screen-enter">
        <div className="flex items-center justify-between px-4 py-3 rounded-[10px] bg-white" style={{ border: '1px solid #E5E7EB' }}>
          <span className="font-semibold text-sm text-[#111827] truncate">{billName}</span>
          <span className="font-semibold text-sm text-[#111827] shrink-0">₹{amountNum.toLocaleString('en-IN')}</span>
        </div>

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

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Split Between</span>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full" style={{ background: '#EEF2FF', border: '1.5px solid #4F46E5' }}>
              <Avatar name={currentUser} size={24} />
              <span className="text-sm font-semibold" style={{ color: '#4F46E5' }}>You</span>
            </div>
            {otherParticipants.map((p) => (
              <div key={p} className="flex items-center gap-1.5 pl-1.5 pr-2 py-1.5 rounded-full bg-white" style={{ border: '1.5px solid #E5E7EB' }}>
                <Avatar name={p} size={24} />
                <span className="text-sm font-semibold text-[#111827]">{p}</span>
                <button onClick={() => removeParticipant(p)} aria-label={`Remove ${p}`} className="flex items-center justify-center rounded-full" style={{ width: 18, height: 18, color: '#9CA3AF' }}>
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addParticipant(participantInput); } }}
              placeholder="Add a person by name"
              className="flex-1 h-11 px-4 rounded-[10px] text-sm font-medium outline-none placeholder:text-[#9CA3AF] placeholder:font-normal"
              style={{ background: '#FFFFFF', border: '1.5px solid #E5E7EB', color: '#111827' }}
            />
            <button
              onClick={() => addParticipant(participantInput)}
              disabled={!participantInput.trim()}
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
                  onClick={() => addParticipant(p)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: '#F4F5F7', color: '#6B7280' }}
                >
                  + {p}
                </button>
              ))}
            </div>
          )}

          {otherParticipants.length === 0 && (
            <span className="text-xs" style={{ color: '#9CA3AF' }}>Add at least one person to split this with.</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Split Method</span>
          <SplitMethodSelector value={method} onChange={setMethod} perHead={amountNum > 0 ? perHead : null} />
        </div>

        {method === 'custom' && (
          <div className="flex flex-col gap-2">
            {selectedList.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <span className="flex-1 text-sm font-semibold text-[#111827]">{p === currentUser ? 'You' : p}</span>
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
