import HomeHero from '../components/HomeHero';
import TabCard from '../components/TabCard';
import EmptyState from '../components/EmptyState';
import { totalOwedToUser } from '../data/appState';

export default function HomeScreen({ tabs, currentUser, onNavigate }) {
  const owed = totalOwedToUser(tabs, currentUser);
  const activeTabs = tabs.filter((t) => !t.settled);
  const hasAnyTabs = tabs.length > 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto hide-scrollbar screen-enter" style={{ background: '#F8FAFC' }}>
      <HomeHero
        currentUser={currentUser}
        amount={`₹${owed.toLocaleString('en-IN')}`}
        badge={
          !hasAnyTabs
            ? 'Create your first tab to get started'
            : owed > 0
              ? "You'll receive across all tabs"
              : "You're all settled up"
        }
      />

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
              title="Ready to split your first bill"
              body={
                <>
                  Tap <span style={{ color: '#4F46E5', fontWeight: 700 }}>+</span> below to create your first tab and start splitting with friends.
                </>
              }
            />
          )
        ) : (
          activeTabs.map((tab) => (
            <TabCard key={tab.id} tab={tab} onClick={() => onNavigate('tabDetail', { tabId: tab.id })} />
          ))
        )}
      </div>

      <div className="h-8 shrink-0" />
    </div>
  );
}
