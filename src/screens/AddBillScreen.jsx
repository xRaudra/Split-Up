import { useMemo, useState } from 'react';
import { Camera, Contact, X, Check, CircleDollarSign } from 'lucide-react';
import TopBar from '../components/TopBar';
import Input from '../components/Input';
import AmountInput from '../components/AmountInput';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import BottomSheet from '../components/BottomSheet';
import ErrorMessage from '../components/ErrorMessage';
import { TAB_TYPES, tabTypeFor } from '../data/tabTypes';
import { displayName } from '../data/appState';

const COMMON_BILL_NAMES = ['Dinner', 'Groceries', 'Cab', 'Rent', 'Drinks'];
const COMMON_TAB_NAMES = ['Trip', 'Roommates', 'Party', 'Weekend Getaway', 'Office Group'];

export default function AddBillScreen({ tabs, currentUser, knownPeople, presetTabId, onNavigate, restore = {} }) {
  const activeTabs = tabs.filter((t) => !t.settled);
  const startDestTabId = restore.destTabId || presetTabId || (activeTabs[0]?.id ?? '__new__');
  const startTab = tabs.find((t) => t.id === startDestTabId);

  const [scanning, setScanning] = useState(false);
  const [billName, setBillName] = useState(restore.billName ?? '');
  const [amount, setAmount] = useState(restore.amount ?? '');
  const [contactsUnavailable, setContactsUnavailable] = useState(false);

  const [destTabId, setDestTabId] = useState(startDestTabId);
  const [newTabName, setNewTabName] = useState(restore.newTabName ?? '');
  const [tabType, setTabType] = useState(restore.tabType ?? null);
  const [tabSheetOpen, setTabSheetOpen] = useState(false);

  const [selected, setSelected] = useState(
    () => new Set(restore.selected ?? [currentUser, ...(startTab ? startTab.participants : [])])
  );
  const [newlyAdded, setNewlyAdded] = useState(() => restore.newlyAdded ?? []);
  const [paidBy, setPaidBy] = useState(restore.paidBy ?? currentUser);
  const [participantInput, setParticipantInput] = useState('');

  const amountNum = Number(amount) || 0;
  const isNewTab = destTabId === '__new__';
  const newTabReady = newTabName.trim().length > 0;
  const selectedType = tabTypeFor(tabType);

  const existingMembers = useMemo(() => {
    if (isNewTab) return [currentUser];
    const tab = tabs.find((t) => t.id === destTabId);
    return [...new Set([currentUser, ...(tab ? tab.participants : [])])];
  }, [isNewTab, destTabId, tabs, currentUser]);

  const finalParticipants = useMemo(
    () => [...existingMembers.filter((p) => selected.has(p)), ...newlyAdded],
    [existingMembers, selected, newlyAdded]
  );

  function switchTab(id) {
    setDestTabId(id);
    const tab = tabs.find((t) => t.id === id);
    setSelected(new Set([currentUser, ...(tab ? tab.participants : [])]));
    setNewlyAdded([]);
  }

  function confirmNewTab() {
    setDestTabId('__new__');
    setSelected(new Set([currentUser]));
    setNewlyAdded([]);
    setTabSheetOpen(false);
  }

  function toggleSelected(name) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  function addPerson(rawName) {
    const name = rawName.trim();
    if (!name) return;
    const alreadyThere =
      existingMembers.some((p) => p.toLowerCase() === name.toLowerCase()) ||
      newlyAdded.some((p) => p.toLowerCase() === name.toLowerCase());
    if (!alreadyThere) setNewlyAdded((prev) => [...prev, name]);
    setParticipantInput('');
  }

  function removeNewlyAdded(name) {
    setNewlyAdded((prev) => prev.filter((p) => p !== name));
    if (paidBy === name) setPaidBy(currentUser);
  }

  async function pickFromContacts() {
    if (!('contacts' in navigator && 'ContactsManager' in window)) {
      setContactsUnavailable(true);
      return;
    }
    try {
      const results = await navigator.contacts.select(['name'], { multiple: true });
      for (const c of results) {
        const name = c.name?.[0];
        if (name) addPerson(name);
      }
    } catch {
      // user cancelled the picker — nothing to do
    }
  }

  const suggestions = knownPeople
    .filter(
      (p) =>
        p !== currentUser &&
        !existingMembers.some((m) => m.toLowerCase() === p.toLowerCase()) &&
        !newlyAdded.some((m) => m.toLowerCase() === p.toLowerCase())
    )
    .slice(0, 5);

  const canContinue = billName.trim() && amountNum > 0 && finalParticipants.length > 0 && (isNewTab ? newTabReady : true);

  function handleContinue() {
    onNavigate('addBillMethod', {
      tabId: presetTabId,
      billName: billName.trim(),
      amount,
      destTabId: isNewTab ? null : destTabId,
      newTabName: isNewTab ? newTabName.trim() : null,
      tabType: isNewTab ? tabType : null,
      participants: finalParticipants,
      newPeople: newlyAdded,
      // Payer doesn't have to be sharing the bill themselves (e.g. paid for
      // others only) - just has to be someone actually on this bill's list.
      paidBy: [...existingMembers, ...newlyAdded].includes(paidBy) ? paidBy : currentUser,
      restoreState: {
        billName: billName.trim(),
        amount,
        destTabId,
        newTabName,
        tabType,
        selected: [...selected],
        newlyAdded,
        paidBy,
      },
    });
  }

  if (scanning) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 px-5 text-center screen-enter" style={{ background: '#111827' }}>
        <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.08)' }}>
          <Camera size={28} color="#FFFFFF" />
        </div>
        <span className="font-semibold text-white text-[16px]">Scanning isn't wired up in this prototype</span>
        <span className="text-sm" style={{ color: '#9CA3AF' }}>In the real app, this camera view reads the bill name and total automatically. For now, continue by typing them in.</span>
        <Button variant="primary" className="w-full mt-2" onClick={() => setScanning(false)}>
          Continue Manually
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title="Add Bill" onBack={() => onNavigate(presetTabId ? 'tabDetail' : 'home', { tabId: presetTabId })} />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-8 flex flex-col gap-5 screen-enter">
        <div className="flex flex-col gap-2">
          <Input label="Bill Name" placeholder="e.g. Dinner at Beach Shack" value={billName} onChange={(e) => setBillName(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {COMMON_BILL_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => setBillName(name)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: billName === name ? '#EEF2FF' : '#F4F5F7', color: billName === name ? '#4F46E5' : '#6B7280' }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <AmountInput label="Amount" value={amount} onChange={setAmount} onScanClick={() => setScanning(true)} />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Add to</span>
          <div className="flex gap-2 flex-wrap">
            {activeTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
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
              onClick={() => setTabSheetOpen(true)}
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

          <div className="flex gap-2">
            <input
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPerson(participantInput); } }}
              placeholder="Add a person by name"
              className="flex-1 h-11 px-4 rounded-[10px] text-sm font-medium text-[#111827] bg-white outline-none placeholder:text-[#9CA3AF] placeholder:font-normal border-[1.5px] border-[#E5E7EB] focus:border-[#4F46E5] transition-colors"
            />
            <button
              onClick={pickFromContacts}
              aria-label="Add from contacts"
              className="flex items-center justify-center rounded-[10px] shrink-0"
              style={{ width: 44, height: 44, background: '#EEF2FF' }}
            >
              <Contact size={19} color="#4F46E5" />
            </button>
            <button
              onClick={() => addPerson(participantInput)}
              disabled={!participantInput.trim()}
              className="h-11 px-4 rounded-[10px] text-sm font-semibold disabled:opacity-40 shrink-0"
              style={{ background: '#EEF2FF', color: '#4F46E5' }}
            >
              Add
            </button>
          </div>

          {contactsUnavailable && (
            <ErrorMessage
              headline="Contacts aren't available here"
              body="This browser doesn't support picking from your contacts. Add people by name above instead."
            />
          )}

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

          <div className="flex flex-col gap-1.5 mt-1">
            {existingMembers.map((p) => {
              const isChecked = selected.has(p);
              const isPayer = paidBy === p;
              return (
                <div
                  key={p}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px]"
                  style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', opacity: isChecked ? 1 : 0.5 }}
                >
                  <Avatar name={p} size={32} />
                  <span className="flex-1 text-sm font-semibold text-[#111827] truncate">{displayName(p, currentUser)}</span>
                  <button
                    onClick={() => setPaidBy(p)}
                    aria-label={`Mark ${displayName(p, currentUser)} as payer`}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0"
                    style={{ background: isPayer ? '#EEF2FF' : '#F4F5F7', color: isPayer ? '#4F46E5' : '#9CA3AF' }}
                  >
                    <CircleDollarSign size={13} />
                    {isPayer ? 'Paid' : 'Paid?'}
                  </button>
                  <button
                    onClick={() => toggleSelected(p)}
                    aria-label={isChecked ? `Remove ${displayName(p, currentUser)} from this bill` : `Include ${displayName(p, currentUser)} in this bill`}
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{
                      width: 22, height: 22,
                      background: isChecked ? '#4F46E5' : '#FFFFFF',
                      border: isChecked ? 'none' : '1.5px solid #E5E7EB',
                    }}
                  >
                    {isChecked && <Check size={13} color="#FFFFFF" />}
                  </button>
                </div>
              );
            })}

            {newlyAdded.map((p) => {
              const isPayer = paidBy === p;
              return (
                <div key={p} className="flex items-center gap-3 px-3 py-2.5 rounded-[10px]" style={{ background: '#EEF2FF', border: '1.5px solid #4F46E5' }}>
                  <Avatar name={p} size={32} />
                  <span className="flex-1 text-sm font-semibold text-[#111827] truncate">{p}</span>
                  <button
                    onClick={() => setPaidBy(p)}
                    aria-label={`Mark ${p} as payer`}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0"
                    style={{ background: isPayer ? '#FFFFFF' : 'transparent', color: isPayer ? '#4F46E5' : '#6B7280' }}
                  >
                    <CircleDollarSign size={13} />
                    {isPayer ? 'Paid' : 'Paid?'}
                  </button>
                  <button
                    onClick={() => removeNewlyAdded(p)}
                    aria-label={`Remove ${p}`}
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{ width: 22, height: 22, color: '#4F46E5' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              );
            })}
          </div>

          {finalParticipants.length === 0 && (
            <span className="text-xs" style={{ color: '#9CA3AF' }}>Select or add at least one person to split this with.</span>
          )}
        </div>

        <div className="flex-1" />

        <Button variant="primary" className="w-full" disabled={!canContinue} onClick={handleContinue}>
          Split It Fairly
        </Button>
      </div>

      <BottomSheet open={tabSheetOpen} onClose={() => setTabSheetOpen(false)} title="Name Your Tab">
        <Input placeholder="e.g. Goa Trip" value={newTabName} onChange={(e) => setNewTabName(e.target.value)} />

        <div className="flex flex-wrap gap-2">
          {COMMON_TAB_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => setNewTabName(name)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: newTabName === name ? '#EEF2FF' : '#F4F5F7', color: newTabName === name ? '#4F46E5' : '#6B7280' }}
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

        <Button variant="primary" className="w-full" disabled={!newTabReady} onClick={confirmNewTab}>
          <Check size={16} />
          Use This Tab
        </Button>
      </BottomSheet>
    </div>
  );
}
