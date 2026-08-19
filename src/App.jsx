import { useState } from 'react';
import './index.css';
import PhoneFrame from './components/PhoneFrame';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import TabsScreen from './screens/TabsScreen';
import TabDetailScreen from './screens/TabDetailScreen';
import AddBillScreen from './screens/AddBillScreen';
import AddBillManualScreen from './screens/AddBillManualScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { currentUser, initialTabs } from './data/mockData';

const navScreens = ['home', 'tabs', 'history', 'profile'];

export default function App() {
  const [tabs, setTabs] = useState(initialTabs);
  const [screen, setScreen] = useState('home');
  const [screenData, setScreenData] = useState(null);

  function navigate(target, data = null) {
    setScreenData(data);
    setScreen(target);
  }

  function markPaid(tabId, person) {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== tabId) return t;
        const paidParticipants = [...new Set([...(t.paidParticipants || []), person])];
        const allPaid = t.participants.every((p) => p === currentUser || paidParticipants.includes(p));
        return { ...t, paidParticipants, settled: t.settled || allPaid };
      })
    );
  }

  function handleAddBillSubmit({ destTabId, newTabName, participants, bill }) {
    setTabs((prev) => {
      if (destTabId) {
        return prev.map((t) =>
          t.id === destTabId
            ? {
                ...t,
                bills: [...t.bills, bill],
                total: t.total + bill.total,
                participants: [...new Set([...t.participants, ...participants])],
                settled: false,
                paidParticipants: [],
                updated: 'just now',
              }
            : t
        );
      }
      const newTab = {
        id: `tab-${Date.now()}`,
        name: newTabName,
        participants,
        bills: [bill],
        total: bill.total,
        settled: false,
        paidParticipants: [],
        updated: 'just now',
      };
      return [newTab, ...prev];
    });
    // A brand-new tab's generated id isn't known here, so land on the Tabs
    // list in that case; otherwise go straight into the tab that was updated.
    navigate(destTabId ? 'tabDetail' : 'tabs', destTabId ? { tabId: destTabId } : null);
  }

  const activeTab = tabs.find((t) => t.id === screenData?.tabId);

  function renderScreen() {
    switch (screen) {
      case 'home':
        return <HomeScreen tabs={tabs} onNavigate={navigate} />;
      case 'tabs':
        return <TabsScreen tabs={tabs} onNavigate={navigate} />;
      case 'tabDetail':
        return <TabDetailScreen tab={activeTab} onNavigate={navigate} onMarkPaid={markPaid} />;
      case 'addBill':
        return <AddBillScreen onNavigate={navigate} presetTabId={screenData?.tabId} />;
      case 'addBillManual':
        return (
          <AddBillManualScreen
            tabs={tabs}
            presetTabId={screenData?.tabId}
            onNavigate={navigate}
            onSubmit={handleAddBillSubmit}
          />
        );
      case 'history':
        return <HistoryScreen tabs={tabs} onNavigate={navigate} />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen tabs={tabs} onNavigate={navigate} />;
    }
  }

  const showNav = navScreens.includes(screen);

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden relative">{renderScreen()}</div>
        {showNav && <BottomNav active={screen} onNavigate={(key) => navigate(key)} />}
      </div>
    </PhoneFrame>
  );
}
