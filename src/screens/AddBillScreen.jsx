import { useMemo, useState } from 'react';
import { Camera, Contact, X } from 'lucide-react';
import TopBar from '../components/TopBar';
import Input from '../components/Input';
import AmountInput from '../components/AmountInput';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import BottomSheet from '../components/BottomSheet';
import { tabTypeFor } from '../data/tabTypes';
import { displayName } from '../data/appState';

const COMMON_BILL_NAMES = ['Dinner', 'Groceries', 'Cab', 'Rent', 'Drinks'];

export default function AddBillScreen({ tabs, currentUser, knownPeople, presetTabId, restore = {}, onNavigate }) {
  const tab = presetTabId ? tabs.find((t) => t.id === presetTabId) : null;
  const selectedType = tab ? tabTypeFor(tab.type) : null;

  const [scanning, setScanning] = useState(false);
  const [billName, setBillName] = useState(restore.billName ?? '');
  const [amount, setAmount] = useState(restore.amount ?? '');
  const [contactsUnavailable, setContactsUnavailable] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);

  const existingMembers = useMemo(
    () => (tab ? [...new Set([currentUser, ...tab.participants])] : [currentUser]),
    [tab, currentUser]
  );

  const [selected, setSelected] = useState(() => new Set(restore.selected ?? existingMembers));
  const [newlyAdded, setNewlyAdded] = useState(() => restore.newlyAdded ?? []);
  const [paidBy, setPaidBy] = useState(restore.paidBy ?? currentUser);
  const [participantInput, setParticipantInput] = useState('');

  const amountNum = Number(amount) || 0;

  const finalParticipants = useMemo(
    () => [...existingMembers.filter((p) => selected.has(p)), ...newlyAdded],
    [existingMembers, selected, newlyAdded]
  );

  function addPerson(rawName) {
    const name = rawName.trim();
    if (!name) return;
    const existingMatch = existingMembers.find((p) => p.toLowerCase() === name.toLowerCase());
    if (existingMatch) {
      setSelected((prev) => new Set(prev).add(existingMatch));
    } else if (!newlyAdded.some((p) => p.toLowerCase() === name.toLowerCase())) {
      setNewlyAdded((prev) => [...prev, name]);
    }
    setParticipantInput('');
  }

  // Existing tab members get excluded (still tab members, just not on this
  // bill), brand-new people get forgotten entirely - either way they leave
  // this bill's list, so the row shows a single X regardless of which.
  function removeFromBill(name) {
    if (newlyAdded.includes(name)) {
      setNewlyAdded((prev) => prev.filter((p) => p !== name));
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    }
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
    .filter((p) => !finalParticipants.some((m) => m.toLowerCase() === p.toLowerCase()))
    .slice(0, 5);

  const canContinue = billName.trim() && amountNum > 0 && finalParticipants.length > 0;

  function handleBack() {
    if (presetTabId) {
      onNavigate('tabDetail', { tabId: presetTabId });
    } else {
      onNavigate('home');
    }
  }

  function handleContinue() {
    const payload = {
      billName: billName.trim(),
      amount,
      participants: finalParticipants,
      newPeople: newlyAdded,
      // Payer doesn't have to be sharing the bill themselves (e.g. paid for
      // others only) - just has to be someone actually on this bill's list.
      paidBy: [...existingMembers, ...newlyAdded].includes(paidBy) ? paidBy : currentUser,
    };
    const restoreSelf = {
      billName: billName.trim(),
      amount,
      selected: [...selected],
      newlyAdded,
      paidBy,
    };

    if (presetTabId) {
      onNavigate('addBillMethod', {
        ...payload,
        presetTabId,
        destTabId: presetTabId,
        newTabName: null,
        tabType: null,
        restoreState: restoreSelf,
      });
    } else {
      onNavigate('addBillTab', { ...payload, restoreAddBill: restoreSelf });
    }
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
      <TopBar title="Add Bill" onBack={handleBack} />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-8 flex flex-col gap-5 screen-enter">
        {tab && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-[10px]" style={{ background: '#EEF2FF' }}>
            {selectedType && <selectedType.Icon size={15} color="#4F46E5" />}
            <span className="text-sm" style={{ color: '#4F46E5' }}>
              Adding to <span className="font-semibold">{tab.name}</span>
            </span>
          </div>
        )}

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

        <div style={{ borderTop: '1px solid #E5E7EB' }} />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
              Split Between ({finalParticipants.length})
            </span>
            <button onClick={() => setAddSheetOpen(true)} className="text-xs font-semibold" style={{ color: '#4F46E5' }}>
              + Add
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {finalParticipants.map((p) => {
              const isPayer = paidBy === p;
              const isNew = newlyAdded.includes(p);
              return (
                <div
                  key={p}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px]"
                  style={{ background: isNew ? '#EEF2FF' : '#FFFFFF', border: isNew ? '1.5px solid #4F46E5' : '1px solid #E5E7EB' }}
                >
                  <Avatar name={p} size={32} />
                  <span className="flex-1 text-sm font-semibold text-[#111827] truncate">{displayName(p, currentUser)}</span>
                  <button
                    onClick={() => setPaidBy(p)}
                    aria-label={`Mark ${displayName(p, currentUser)} as payer`}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0"
                    style={{ background: isPayer ? (isNew ? '#FFFFFF' : '#EEF2FF') : (isNew ? 'transparent' : '#F4F5F7'), color: isPayer ? '#4F46E5' : (isNew ? '#6B7280' : '#9CA3AF') }}
                  >
                    {isPayer ? 'Payer' : 'Payer?'}
                  </button>
                  <button
                    onClick={() => removeFromBill(p)}
                    aria-label={`Remove ${displayName(p, currentUser)} from this bill`}
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{ width: 22, height: 22, color: isNew ? '#4F46E5' : '#9CA3AF' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              );
            })}
          </div>

          {finalParticipants.length === 0 && (
            <span className="text-xs" style={{ color: '#9CA3AF' }}>No one added yet — tap + Add to start splitting.</span>
          )}
        </div>

        <div className="flex-1" />

        <Button variant="primary" className="w-full" disabled={!canContinue} onClick={handleContinue}>
          {presetTabId ? 'Split It Fairly' : 'Continue'}
        </Button>
      </div>

      <BottomSheet open={addSheetOpen} onClose={() => setAddSheetOpen(false)} title="Add to Split">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPerson(participantInput); } }}
              placeholder="Add a person by name"
              className="w-full h-11 pl-4 pr-11 rounded-[10px] text-sm font-medium text-[#111827] bg-white outline-none placeholder:text-[#9CA3AF] placeholder:font-normal border-[1.5px] border-[#E5E7EB] focus:border-[#4F46E5] transition-colors"
            />
            <button
              onClick={pickFromContacts}
              aria-label="Add from contacts"
              className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{ width: 34, height: 34 }}
            >
              <Contact size={16} color="#4F46E5" />
            </button>
          </div>
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
                + {displayName(p, currentUser)}
              </button>
            ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
