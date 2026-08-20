import { useState } from 'react';
import './index.css';
import PhoneFrame from './components/PhoneFrame';
import BottomNav from './components/BottomNav';
import WelcomeScreen from './screens/WelcomeScreen';
import OnboardingNameScreen from './screens/OnboardingNameScreen';
import HomeScreen from './screens/HomeScreen';
import TabsScreen from './screens/TabsScreen';
import TabDetailScreen from './screens/TabDetailScreen';
import AddToTabScreen from './screens/AddToTabScreen';
import AddBillScreen from './screens/AddBillScreen';
import AddBillMethodScreen from './screens/AddBillMethodScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { settlementsForTab, uniqueName } from './data/appState';

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
        paidSettlements: (t.paidSettlements || []).map((key) =>
          key.split('|').map((p) => (p === oldName ? newName : p)).join('|')
        ),
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

  function markPaid(tabId, from, to) {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== tabId) return t;
        const paidSettlements = [...new Set([...(t.paidSettlements || []), `${from}|${to}`])];
        const updated = { ...t, paidSettlements };
        const stillPending = settlementsForTab(updated).some((s) => s.status === 'pending');
        return { ...updated, settled: t.settled || !stillPending };
      })
    );
  }

  function handleAddParticipant(tabId, name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== tabId) return t;
        if (t.participants.some((p) => p.toLowerCase() === trimmed.toLowerCase())) return t;
        return { ...t, participants: [...t.participants, trimmed] };
      })
    );
    setKnownPeople((prev) => [...new Set([...prev, trimmed])]);
  }

  function handleAddBillSubmit({ destTabId, newTabName, tabType, participants, newPeople, bill, standalone }) {
    setKnownPeople((prev) => [...new Set([...prev, ...newPeople])]);
    const targetTabId = destTabId || `tab-${Date.now()}`;
    setTabs((prev) => {
      if (destTabId) {
        return prev.map((t) => {
          if (t.id !== destTabId) return t;
          const uniqueBill = { ...bill, name: uniqueName(bill.name, t.bills.map((b) => b.name)) };
          return {
            ...t,
            // Explicitly choosing a tab as this bill's destination "graduates"
            // it out of the Bills category, even if it started standalone.
            standalone: false,
            bills: [...t.bills, uniqueBill],
            total: t.total + uniqueBill.total,
            participants: [...new Set([...t.participants, ...participants])],
            settled: false,
            paidSettlements: [],
            updated: 'just now',
          };
        });
      }
      const newTab = {
        id: targetTabId,
        name: uniqueName(newTabName, prev.map((t) => t.name)),
        type: tabType,
        standalone: !!standalone,
        participants,
        bills: [bill],
        total: bill.total,
        settled: false,
        paidSettlements: [],
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
        return <TabsScreen tabs={tabs} currentUser={currentUser} initialView={screenData?.view} onNavigate={navigate} />;
      case 'tabDetail':
        return (
          <TabDetailScreen
            tab={activeTab}
            currentUser={currentUser}
            knownPeople={knownPeople}
            onNavigate={navigate}
            onMarkPaid={markPaid}
            onAddParticipant={handleAddParticipant}
          />
        );
      case 'addBillTab':
        return (
          <AddToTabScreen
            tabs={tabs}
            billName={screenData?.billName}
            amount={screenData?.amount}
            participants={screenData?.participants}
            newPeople={screenData?.newPeople}
            paidBy={screenData?.paidBy}
            restoreAddBill={screenData?.restoreAddBill}
            restore={screenData?.restore}
            onNavigate={navigate}
          />
        );
      case 'addBill':
        return (
          <AddBillScreen
            tabs={tabs}
            currentUser={currentUser}
            knownPeople={knownPeople}
            presetTabId={screenData?.tabId}
            restore={screenData?.restore}
            onNavigate={navigate}
          />
        );
      case 'addBillMethod':
        return (
          <AddBillMethodScreen
            currentUser={currentUser}
            billName={screenData?.billName}
            amount={screenData?.amount}
            participants={screenData?.participants}
            newPeople={screenData?.newPeople}
            destTabId={screenData?.destTabId}
            newTabName={screenData?.newTabName}
            tabType={screenData?.tabType}
            paidBy={screenData?.paidBy}
            presetTabId={screenData?.presetTabId}
            restoreState={screenData?.restoreState}
            restoreAddBill={screenData?.restoreAddBill}
            skipTabPicker={screenData?.skipTabPicker}
            standalone={screenData?.standalone}
            onNavigate={navigate}
            onSubmit={handleAddBillSubmit}
          />
        );
      case 'history':
        return <HistoryScreen tabs={tabs} onNavigate={navigate} />;
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
