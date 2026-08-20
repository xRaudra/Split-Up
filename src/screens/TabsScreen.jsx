import { useState } from 'react';
import TopBar from '../components/TopBar';
import TabCard from '../components/TabCard';
import EmptyState from '../components/EmptyState';
import { displayName } from '../data/appState';

const VIEWS = [
  { key: 'bill', label: 'Bill' },
  { key: 'splits', label: 'Splits' },
];

export default function TabsScreen({ tabs, currentUser, onNavigate }) {
  const [view, setView] = useState('splits');
  const active = tabs.filter((t) => !t.settled);
  const settled = tabs.filter((t) => t.settled);

  const allBills = tabs
    .flatMap((t) => t.bills.map((b) => ({ ...b, splitId: t.id, splitName: t.name })))
    .sort((a, b) => (Number(b.id.split('-')[1]) || 0) - (Number(a.id.split('-')[1]) || 0));

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title="Splits" />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-6 screen-enter">
        {tabs.length === 0 ? (
          <EmptyState
            title="No splits yet"
            body="Create your first split to start adding bills with friends."
            ctaLabel="Create Split"
            onCta={() => onNavigate('addBill')}
          />
        ) : (
          <>
            <div className="flex gap-1 p-1 rounded-full mt-2 mb-5" style={{ background: '#F4F5F7' }}>
              {VIEWS.map(({ key, label }) => {
                const isActive = view === key;
                return (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    className="flex-1 py-2 rounded-full text-sm font-semibold transition-colors"
                    style={{
                      background: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? '#4F46E5' : '#6B7280',
                      boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {view === 'bill' ? (
              <div className="flex flex-col gap-3">
                {allBills.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onNavigate('tabDetail', { tabId: b.splitId })}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left bg-white"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-semibold text-sm text-[#111827] truncate">{b.name}</span>
                      <span className="text-xs text-[#6B7280] truncate">{b.splitName} · Paid by {displayName(b.paidBy, currentUser)}</span>
                    </div>
                    <span className="font-semibold text-sm text-[#111827] shrink-0">₹{b.total.toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                {active.length > 0 && (
                  <>
                    <span className="block font-semibold text-[13px] text-[#6B7280] uppercase tracking-wide mb-2">Active</span>
                    <div className="flex flex-col gap-3 mb-5">
                      {active.map((tab) => (
                        <TabCard key={tab.id} tab={tab} onClick={() => onNavigate('tabDetail', { tabId: tab.id })} />
                      ))}
                    </div>
                  </>
                )}

                {settled.length > 0 && (
                  <>
                    <span className="block font-semibold text-[13px] text-[#6B7280] uppercase tracking-wide mb-2">Settled</span>
                    <div className="flex flex-col gap-3">
                      {settled.map((tab) => (
                        <TabCard key={tab.id} tab={tab} onClick={() => onNavigate('tabDetail', { tabId: tab.id })} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
