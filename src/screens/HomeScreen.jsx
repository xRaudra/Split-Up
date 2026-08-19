import SummaryCard from '../components/SummaryCard';
import TabCard from '../components/TabCard';
import EmptyState from '../components/EmptyState';
import { totalOwedToUser } from '../data/appState';

export default function HomeScreen({ tabs, currentUser, onNavigate }) {
  const owed = totalOwedToUser(tabs, currentUser);
  const activeTabs = tabs.filter((t) => !t.settled);
  const firstName = currentUser.split(' ')[0];
  const hasAnyTabs = tabs.length > 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto hide-scrollbar screen-enter" style={{ background: '#F8FAFC' }}>
      <div className="px-5 pt-6 pb-2">
        <span className="text-sm text-[#6B7280]">Hey {firstName} 👋</span>
        <h1 className="text-[22px] font-bold text-[#111827] mt-0.5">
          {hasAnyTabs ? 'Your split, at a glance' : "Let's split your first bill"}
        </h1>
      </div>

      {hasAnyTabs && (
        <div className="px-5 mt-5">
          <SummaryCard
            headline={owed > 0 ? `You're owed ₹${owed.toLocaleString('en-IN')}` : "You're all settled up"}
            sub={owed > 0 ? 'Across all active tabs' : 'Nothing pending right now'}
            tone={owed > 0 ? 'neutral' : 'positive'}
          />
        </div>
      )}

      {activeTabs.length > 0 && (
        <div className="flex items-center justify-between px-5 mt-5 mb-2">
          <span className="font-semibold text-[15px] text-[#111827]">Active Tabs</span>
          <button onClick={() => onNavigate('tabs')} className="text-xs font-semibold text-[#4F46E5]">See all</button>
        </div>
      )}

      <div className={`flex flex-col gap-3 px-5 ${activeTabs.length > 0 ? '' : 'mt-5'}`}>
        {activeTabs.length === 0 ? (
          hasAnyTabs ? (
            <button onClick={() => onNavigate('history')} className="text-center text-sm py-2" style={{ color: '#6B7280' }}>
              No active tabs right now — see settled ones in <span style={{ color: '#4F46E5', fontWeight: 600 }}>History</span>
            </button>
          ) : (
            <EmptyState
              title="No tabs yet"
              body="A tab groups the bills for a trip, dinner, or shared house — create one to start splitting with friends."
              ctaLabel="Create Your First Tab"
              onCta={() => onNavigate('addBill')}
            />
          )
        ) : (
          activeTabs.map((tab) => (
            <TabCard key={tab.id} tab={tab} onClick={() => onNavigate('tabDetail', { tabId: tab.id })} />
          ))
        )}
      </div>

      {hasAnyTabs && (
        <div className="px-5 mt-5 mb-8">
          <button
            onClick={() => onNavigate('addBill')}
            className="w-full h-12 rounded-[10px] font-semibold text-[15px] text-white"
            style={{ background: '#4F46E5' }}
          >
            + Add Bill
          </button>
        </div>
      )}
    </div>
  );
}
