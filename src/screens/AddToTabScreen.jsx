import { useState } from 'react';
import { Check } from 'lucide-react';
import TopBar from '../components/TopBar';
import Input from '../components/Input';
import Button from '../components/Button';
import BottomSheet from '../components/BottomSheet';
import { TAB_TYPES, tabTypeFor } from '../data/tabTypes';

const COMMON_TAB_NAMES = ['Trip', 'Roommates', 'Party', 'Weekend Getaway', 'Office Group'];

export default function AddToTabScreen({
  tabs, onNavigate, restore = {},
  billName, amount, participants, newPeople, paidBy, restoreAddBill,
}) {
  const activeTabs = tabs.filter((t) => !t.settled);
  const [destTabId, setDestTabId] = useState(restore.destTabId || (activeTabs[0]?.id ?? '__new__'));
  const [newTabName, setNewTabName] = useState(restore.newTabName ?? '');
  const [tabType, setTabType] = useState(restore.tabType ?? null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const isNewTab = destTabId === '__new__';
  const newTabReady = newTabName.trim().length > 0;
  const selectedType = tabTypeFor(tabType);
  const canContinue = isNewTab ? newTabReady : true;

  function confirmNewTab() {
    setDestTabId('__new__');
    setSheetOpen(false);
  }

  function handleBack() {
    onNavigate('addBill', { restore: restoreAddBill });
  }

  function handleContinue() {
    onNavigate('addBillMethod', {
      billName,
      amount,
      participants,
      newPeople,
      paidBy,
      destTabId: isNewTab ? null : destTabId,
      newTabName: isNewTab ? newTabName.trim() : null,
      tabType: isNewTab ? tabType : null,
      restoreAddBill,
    });
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title="Add to a Split" onBack={handleBack} />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-8 flex flex-col gap-5 screen-enter">
        <span className="text-sm text-[#6B7280]">Every bill lives inside a split — pick one, or start a new one.</span>

        <div className="flex flex-col gap-2">
          {activeTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setDestTabId(t.id)}
              className="flex items-center justify-between px-4 py-3.5 rounded-[10px] text-left"
              style={{
                background: destTabId === t.id ? '#EEF2FF' : '#FFFFFF',
                border: `1.5px solid ${destTabId === t.id ? '#4F46E5' : '#E5E7EB'}`,
              }}
            >
              <span className="font-semibold text-sm" style={{ color: destTabId === t.id ? '#4F46E5' : '#111827' }}>{t.name}</span>
              {destTabId === t.id && <Check size={16} color="#4F46E5" />}
            </button>
          ))}

          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center justify-between px-4 py-3.5 rounded-[10px] text-left"
            style={{
              background: isNewTab ? '#EEF2FF' : '#FFFFFF',
              border: `1.5px solid ${isNewTab ? '#4F46E5' : '#E5E7EB'}`,
            }}
          >
            <span className="flex items-center gap-1.5 font-semibold text-sm" style={{ color: isNewTab ? '#4F46E5' : '#111827' }}>
              {isNewTab && selectedType && <selectedType.Icon size={15} />}
              {isNewTab && newTabReady ? newTabName : '+ New Split'}
            </span>
            {isNewTab && <Check size={16} color="#4F46E5" />}
          </button>
        </div>

        <div className="flex-1" />

        <Button variant="primary" className="w-full" disabled={!canContinue} onClick={handleContinue}>
          Continue
        </Button>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Name Your Split">
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
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Split Type (optional)</span>
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
          Use This Split
        </Button>
      </BottomSheet>
    </div>
  );
}
