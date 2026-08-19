import { useState } from 'react';
import './index.css';
import PhoneFrame from './components/PhoneFrame';
import BottomNav from './components/BottomNav';
import WelcomeScreen from './screens/WelcomeScreen';
import OnboardingNameScreen from './screens/OnboardingNameScreen';
import HomeScreen from './screens/HomeScreen';
import TabsScreen from './screens/TabsScreen';
import TabDetailScreen from './screens/TabDetailScreen';
import AddBillScreen from './screens/AddBillScreen';
import AddBillSplitScreen from './screens/AddBillSplitScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';

const navScreens = ['home', 'tabs', 'history', 'profile'];

export default function App() {
  const [tabs, setTabs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [knownPeople, setKnownPeople] = useState([]);
  const [screen, setScreen] = useState('welcome');
  const [screenData, setScreenData] = useState(null);

  function navigate(target, data = null) {
    setScreenData(data);
    setScreen(target);
  }

  function handleSetName(name) {
    setCurrentUser(name);
    setKnownPeople([name]);
    navigate('home');
  }

  // Renaming mid-session has to cascade through every tab, or old bills would
  // silently reference a name that no longer matches "You".
  function handleRename(newName) {
    const oldName = currentUser;
    if (newName === oldName) return;
    setTabs((prev) =>
      prev.map((t) => ({
        ...t,
        participants: t.participants.map((p) => (p === oldName ? newName : p)),
        paidParticipants: (t.paidParticipants || []).map((p) => (p === oldName ? newName : p)),
        bills: t.bills.map((b) => ({
          ...b,
          paidBy: b.paidBy === oldName ? newName : b.paidBy,
          shares: Object.fromEntries(Object.entries(b.shares).map(([p, v]) => [p === oldName ? newName : p, v])),
        })),
      }))
    );
    setKnownPeople((prev) => prev.map((p) => (p === oldName ? newName : p)));
    setCurrentUser(newName);
  }

  function handleResetData() {
    setTabs([]);
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

  function handleAddBillSubmit({ destTabId, newTabName, participants, newPeople, bill }) {
    setKnownPeople((prev) => [...new Set([...prev, ...newPeople])]);
    const targetTabId = destTabId || `tab-${Date.now()}`;
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
        id: targetTabId,
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
    navigate('tabDetail', { tabId: targetTabId });
  }

  const activeTab = tabs.find((t) => t.id === screenData?.tabId);

  function renderScreen() {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={navigate} />;
      case 'setupName':
        return <OnboardingNameScreen onSubmit={handleSetName} />;
      case 'home':
        return <HomeScreen tabs={tabs} currentUser={currentUser} onNavigate={navigate} />;
      case 'tabs':
        return <TabsScreen tabs={tabs} onNavigate={navigate} />;
      case 'tabDetail':
        return <TabDetailScreen tab={activeTab} currentUser={currentUser} onNavigate={navigate} onMarkPaid={markPaid} />;
      case 'addBill':
        return (
          <AddBillScreen
            onNavigate={navigate}
            presetTabId={screenData?.tabId}
            initialBillName={screenData?.billName}
            initialAmount={screenData?.amount}
          />
        );
      case 'addBillSplit':
        return (
          <AddBillSplitScreen
            tabs={tabs}
            currentUser={currentUser}
            knownPeople={knownPeople}
            billName={screenData?.billName}
            amount={screenData?.amount}
            presetTabId={screenData?.tabId}
            onNavigate={navigate}
            onSubmit={handleAddBillSubmit}
          />
        );
      case 'history':
        return <HistoryScreen tabs={tabs} currentUser={currentUser} onNavigate={navigate} />;
      case 'profile':
        return <ProfileScreen currentUser={currentUser} onRename={handleRename} onResetData={handleResetData} />;
      default:
        return <HomeScreen tabs={tabs} currentUser={currentUser} onNavigate={navigate} />;
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
