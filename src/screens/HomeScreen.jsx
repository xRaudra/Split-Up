import HomeHero from '../components/HomeHero';
import TabCard from '../components/TabCard';
import EmptyState from '../components/EmptyState';
import { netBalanceForUser, balanceBreakdownForUser } from '../data/appState';

export default function HomeScreen({ tabs, currentUser, onNavigate }) {
  const net = netBalanceForUser(tabs, currentUser);
  const { receivable, owed } = balanceBreakdownForUser(tabs, currentUser);
  const activeTabs = tabs.filter((t) => !t.settled);
  const hasAnyTabs = tabs.length > 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto hide-scrollbar screen-enter" style={{ background: '#F8FAFC' }}>
      <HomeHero
        currentUser={currentUser}
        amount={`₹${Math.abs(net).toLocaleString('en-IN')}`}
        receivable={receivable}
        owed={owed}
      />

      {activeTabs.length > 0 && (
        <div className="flex items-center justify-between px-5 mt-5 mb-2">
          <span className="font-semibold text-[15px] text-[#111827]">Active Splits</span>
          <button onClick={() => onNavigate('tabs')} className="text-xs font-semibold text-[#4F46E5]">See all</button>
        </div>
      )}

      <div className={`flex flex-col gap-3 px-5 ${activeTabs.length > 0 ? '' : 'mt-5'}`}>
        {activeTabs.length === 0 ? (
          hasAnyTabs ? (
            <button onClick={() => onNavigate('history')} className="text-center text-sm py-2" style={{ color: '#6B7280' }}>
              No active splits right now — see settled ones in <span style={{ color: '#4F46E5', fontWeight: 600 }}>History</span>
            </button>
          ) : (
            <EmptyState
              title="Ready to split your first bill"
              body={
                <>
                  Tap <span style={{ color: '#4F46E5', fontWeight: 700 }}>+</span> below to create your first split and start adding bills with friends.
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
