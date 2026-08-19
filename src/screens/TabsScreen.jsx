import TopBar from '../components/TopBar';
import TabCard from '../components/TabCard';
import EmptyState from '../components/EmptyState';

export default function TabsScreen({ tabs, onNavigate }) {
  const active = tabs.filter((t) => !t.settled);
  const settled = tabs.filter((t) => t.settled);

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title="Tabs" />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-6 screen-enter">
        {tabs.length === 0 && (
          <EmptyState
            title="No tabs yet"
            body="Create your first tab to start splitting bills with friends."
            ctaLabel="Create Tab"
            onCta={() => onNavigate('addBill')}
          />
        )}

        {active.length > 0 && (
          <>
            <span className="block font-semibold text-[13px] text-[#6B7280] uppercase tracking-wide mt-2 mb-2">Active</span>
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
      </div>
    </div>
  );
}
