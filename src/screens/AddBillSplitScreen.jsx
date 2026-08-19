import { useMemo, useState } from 'react';
import { X, Check } from 'lucide-react';
import TopBar from '../components/TopBar';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import BottomSheet from '../components/BottomSheet';
import { TAB_TYPES, tabTypeFor } from '../data/tabTypes';

const COMMON_TAB_NAMES = ['Trip', 'Roommates', 'Party', 'Weekend Getaway', 'Office Group'];

export default function AddBillSplitScreen({
  tabs, currentUser, knownPeople, billName, amount, presetTabId, onNavigate, onNext,
  initialDestTabId, initialNewTabName = '', initialTabType = null, initialParticipants,
}) {
  const activeTabs = tabs.filter((t) => !t.settled);
  const startDestTabId = initialDestTabId || presetTabId || (activeTabs[0]?.id ?? '__new__');
  const startTab = tabs.find((t) => t.id === startDestTabId);
  const [destTabId, setDestTabId] = useState(startDestTabId);
  const [newTabName, setNewTabName] = useState(initialNewTabName);
  const [tabType, setTabType] = useState(initialTabType);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [otherParticipants, setOtherParticipants] = useState(
    () => initialParticipants ?? (startTab ? startTab.participants.filter((p) => p !== currentUser) : [])
  );
  const [participantInput, setParticipantInput] = useState('');

  const selectedList = useMemo(() => [currentUser, ...otherParticipants], [currentUser, otherParticipants]);
  const amountNum = Number(amount) || 0;

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

  const suggestions = knownPeople
    .filter((p) => p !== currentUser && !otherParticipants.some((op) => op.toLowerCase() === p.toLowerCase()))
    .slice(0, 5);

  const isNewTab = destTabId === '__new__';
  const newTabReady = newTabName.trim().length > 0;
  const canContinue = otherParticipants.length > 0 && (isNewTab ? newTabReady : true);
  const selectedType = tabTypeFor(tabType);

  function handleContinue() {
    onNext({
      destTabId: isNewTab ? null : destTabId,
      newTabName: isNewTab ? newTabName.trim() : null,
      tabType: isNewTab ? tabType : null,
      participants: selectedList,
      newPeople: otherParticipants,
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
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold"
              style={{
                background: isNewTab ? '#EEF2FF' : '#FFFFFF',
                color: isNewTab ? '#4F46E5' : '#111827',
                border: `1.5px solid ${isNewTab ? '#4F46E5' : '#E5E7EB'}`,
              }}
            >
              {isNewTab && selectedType && <selectedType.Icon size={14} />}
              {isNewTab && newTabReady ? newTabName : '+ New Tab'}
            </button>
          </div>
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
              className="flex-1 h-11 px-4 rounded-[10px] text-sm font-medium text-[#111827] bg-white outline-none placeholder:text-[#9CA3AF] placeholder:font-normal border-[1.5px] border-[#E5E7EB] focus:border-[#4F46E5] transition-colors"
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

        <div className="flex-1" />

        <Button variant="primary" className="w-full" disabled={!canContinue} onClick={handleContinue}>
          Split It Fairly
        </Button>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Name Your Tab">
        <Input placeholder="e.g. Goa Trip" value={newTabName} onChange={(e) => setNewTabName(e.target.value)} />

        <div className="flex flex-wrap gap-2">
          {COMMON_TAB_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => setNewTabName(name)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: newTabName === name ? '#EEF2FF' : '#F4F5F7',
                color: newTabName === name ? '#4F46E5' : '#6B7280',
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Tab Type (optional)</span>
          <div className="flex flex-wrap gap-2">
            {TAB_TYPES.map(({ key, label, Icon }) => {
              const isSelected = tabType === key;
              return (
                <button
                  key={key}
                  onClick={() => setTabType(isSelected ? null : key)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: isSelected ? '#EEF2FF' : '#FFFFFF',
                    color: isSelected ? '#4F46E5' : '#111827',
                    border: `1.5px solid ${isSelected ? '#4F46E5' : '#E5E7EB'}`,
                  }}
                >
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full"
          disabled={!newTabReady}
          onClick={() => { setDestTabId('__new__'); setSheetOpen(false); }}
        >
          <Check size={16} />
          Use This Tab
        </Button>
      </BottomSheet>
    </div>
  );
}
