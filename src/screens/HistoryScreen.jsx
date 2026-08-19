import TopBar from '../components/TopBar';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { settlementsForTab } from '../data/appState';

export default function HistoryScreen({ tabs, onNavigate }) {
  const settledTabs = tabs.filter((t) => t.settled);

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title="History" />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-6 screen-enter">
        {settledTabs.length === 0 ? (
          <EmptyState title="No settled tabs yet" body="Once a tab is fully paid up, it'll show up here." />
        ) : (
          <div className="flex flex-col gap-3">
            {settledTabs.map((tab) => {
              const settlements = settlementsForTab(tab);
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate('tabDetail', { tabId: tab.id })}
                  className="flex flex-col gap-3 px-5 py-4 rounded-xl text-left bg-white"
                  style={{ border: '1px solid #E5E7EB' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[15px] text-[#111827]">{tab.name}</span>
                    <StatusBadge type="settled" />
                  </div>
                  <span className="font-bold text-[18px] text-[#111827]">₹{tab.total.toLocaleString('en-IN')}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {tab.participants.map((p) => <Avatar key={p} name={p} size={24} />)}
                    </div>
                    <span className="text-xs text-[#6B7280]">
                      {settlements.length} settlement{settlements.length !== 1 ? 's' : ''} · fully paid
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
