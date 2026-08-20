import { useState } from 'react';
import TabCard from '../components/TabCard';
import EmptyState from '../components/EmptyState';
import { displayName } from '../data/appState';

const VIEWS = [
  { key: 'bills', label: 'Bills' },
  { key: 'tabs', label: 'Tabs' },
];

export default function TabsScreen({ tabs, currentUser, initialView, onNavigate }) {
  const [view, setView] = useState(initialView || 'bills');

  // A bill added via "Continue without a Split" lives in an auto-created,
  // never-explicitly-chosen tab (standalone: true) and surfaces under
  // Bills instead. The moment a bill is deliberately placed into a tab
  // (new or existing), that tab's standalone flag clears - see App.jsx's
  // handleAddBillSubmit.
  const standaloneTabs = tabs.filter((t) => t.standalone);
  const realTabs = tabs.filter((t) => !t.standalone);
  const active = realTabs.filter((t) => !t.settled);
  const settled = realTabs.filter((t) => t.settled);

  const standaloneBills = standaloneTabs
    .flatMap((t) => t.bills.map((b) => ({ ...b, splitId: t.id })))
    .sort((a, b) => (Number(b.id.split('-')[1]) || 0) - (Number(a.id.split('-')[1]) || 0));

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      {tabs.length > 0 && (
        <div className="flex justify-center pt-4 pb-3 shrink-0">
          <div className="flex gap-1 p-2 rounded-full" style={{ background: '#F4F5F7' }}>
            {VIEWS.map(({ key, label }) => {
              const isActive = view === key;
              return (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className="px-8 py-2 rounded-full text-xs font-semibold transition-colors"
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
        </div>
      )}

      <div
        className={`flex-1 overflow-y-auto hide-scrollbar px-5 pb-6 screen-enter ${
          tabs.length === 0 ? 'flex flex-col items-center justify-center' : ''
        }`}
      >
        {tabs.length === 0 ? (
          <EmptyState
            title="No splits yet"
            body="Create your first split to start adding bills with friends."
            ctaLabel="Create Split"
            onCta={() => onNavigate('addBill')}
          />
        ) : (
          <>
            {view === 'bills' ? (
              standaloneBills.length === 0 ? (
                <EmptyState
                  title="No standalone bills"
                  body="Bills added straight to a tab show up under Tabs instead."
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {standaloneBills.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => onNavigate('tabDetail', { tabId: b.splitId })}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left bg-white"
                      style={{ border: '1px solid #E5E7EB' }}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-semibold text-sm text-[#111827] truncate">{b.name}</span>
                        <span className="text-xs text-[#6B7280] truncate">Paid by {displayName(b.paidBy, currentUser)}</span>
                      </div>
                      <span className="font-semibold text-sm text-[#111827] shrink-0">₹{b.total.toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                </div>
              )
            ) : active.length === 0 && settled.length === 0 ? (
              <EmptyState
                title="No tabs yet"
                body="Bills added without picking a tab show up under Bills instead."
              />
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
