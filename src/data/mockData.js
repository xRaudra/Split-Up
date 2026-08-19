export const currentUser = 'Ananya Rao';

export const people = ['Ananya Rao', 'Kabir Mehta', 'Priya Sharma', 'Rohan Verma'];

// Goa Trip — reconciled so per-person totals match the shared bills below.
const goaBills = [
  {
    id: 'cab',
    name: 'Cab to Airport',
    total: 1800,
    paidBy: 'Ananya Rao',
    method: 'equally',
    shares: { 'Ananya Rao': 450, 'Kabir Mehta': 450, 'Priya Sharma': 450, 'Rohan Verma': 450 },
  },
  {
    id: 'dinner',
    name: 'Dinner at Beach Shack',
    total: 3267,
    paidBy: 'Ananya Rao',
    method: 'items',
    items: [
      { name: 'Food', amount: 2000, splitAmong: ['Ananya Rao', 'Kabir Mehta', 'Priya Sharma', 'Rohan Verma'] },
      { name: 'Drinks', amount: 1200, splitAmong: ['Kabir Mehta', 'Priya Sharma', 'Rohan Verma'] },
      { name: 'Dessert', amount: 67, splitAmong: ['Kabir Mehta'] },
    ],
    shares: { 'Ananya Rao': 500, 'Kabir Mehta': 967, 'Priya Sharma': 900, 'Rohan Verma': 900 },
  },
  {
    id: 'drinks',
    name: 'Late Night Drinks',
    total: 1050,
    paidBy: 'Ananya Rao',
    method: 'custom',
    shares: { 'Ananya Rao': 0, 'Kabir Mehta': 350, 'Priya Sharma': 350, 'Rohan Verma': 350 },
  },
];

const diwaliBills = [
  {
    id: 'diwali-dinner',
    name: 'Dinner',
    total: 3200,
    paidBy: 'Ananya Rao',
    method: 'equally',
    shares: { 'Ananya Rao': 1600, 'Priya Sharma': 1600 },
  },
];

function sumShares(bills, person) {
  return bills.reduce((sum, b) => sum + (b.shares[person] || 0), 0);
}

function billsTotal(bills) {
  return bills.reduce((sum, b) => sum + b.total, 0);
}

export const initialTabs = [
  {
    id: 'goa-trip',
    name: 'Goa Trip',
    participants: ['Ananya Rao', 'Kabir Mehta', 'Priya Sharma', 'Rohan Verma'],
    bills: goaBills,
    total: billsTotal(goaBills),
    settled: false,
    paidParticipants: [],
    updated: '2h ago',
  },
  {
    id: 'diwali-dinner',
    name: 'Diwali Dinner',
    participants: ['Ananya Rao', 'Priya Sharma'],
    bills: diwaliBills,
    total: billsTotal(diwaliBills),
    settled: true,
    paidParticipants: ['Priya Sharma'],
    updated: 'Settled',
  },
];

// Who owes `currentUser` what, per tab (currentUser assumed payer on all bills for MVP).
export function settlementsForTab(tab) {
  return tab.participants
    .filter((p) => p !== currentUser)
    .map((p) => ({
      from: p,
      to: currentUser,
      amount: sumShares(tab.bills, p),
      status: tab.settled || tab.paidParticipants?.includes(p) ? 'paid' : 'pending',
    }))
    .filter((s) => s.amount > 0);
}

export function totalOwedToUser(tabs) {
  return tabs
    .flatMap((t) => settlementsForTab(t))
    .filter((s) => s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);
}
