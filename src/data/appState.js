// No mock data, no persistence — everything here operates on whatever the
// user creates in a session. State lives in App.jsx (React state only), so
// closing the tab clears it; nothing is written to storage or a server.

export function billsTotal(bills) {
  return bills.reduce((sum, b) => sum + b.total, 0);
}

// Shows "You" for the current user, their real name for everyone else —
// avoids the odd "Ananya owes Ananya" framing you'd otherwise get.
export function displayName(name, currentUser) {
  return name === currentUser ? 'You' : name;
}

function settlementKey(from, to) {
  return `${from}|${to}`;
}

// Each bill can have a different payer, so "who owes whom" isn't a single
// direction anymore — it's a net balance per person (what they paid, minus
// what their own shares came to across every bill in the tab), resolved
// into the smallest set of payments via greedy debt simplification (match
// the biggest debtor against the biggest creditor, repeat).
export function settlementsForTab(tab) {
  const balances = {};
  for (const p of tab.participants) balances[p] = 0;
  for (const bill of tab.bills) {
    balances[bill.paidBy] = (balances[bill.paidBy] || 0) + bill.total;
    for (const [person, share] of Object.entries(bill.shares)) {
      balances[person] = (balances[person] || 0) - share;
    }
  }

  const creditors = Object.entries(balances)
    .filter(([, v]) => v > 0.5)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
  const debtors = Object.entries(balances)
    .filter(([, v]) => v < -0.5)
    .map(([name, amount]) => ({ name, amount: -amount }))
    .sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.round(Math.min(debtor.amount, creditor.amount));
    if (amount > 0) {
      const key = settlementKey(debtor.name, creditor.name);
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount,
        status: tab.settled || (tab.paidSettlements || []).includes(key) ? 'paid' : 'pending',
      });
    }
    debtor.amount -= amount;
    creditor.amount -= amount;
    if (debtor.amount < 1) i++;
    if (creditor.amount < 1) j++;
  }
  return settlements;
}

// Net position across all active tabs: positive = you're owed overall,
// negative = you owe overall. Can be either now that any participant can
// be a bill's payer, not just the current user.
export function netBalanceForUser(tabs, currentUser) {
  let net = 0;
  for (const tab of tabs) {
    for (const s of settlementsForTab(tab)) {
      if (s.status !== 'pending') continue;
      if (s.to === currentUser) net += s.amount;
      if (s.from === currentUser) net -= s.amount;
    }
  }
  return net;
}

// Raw components behind the net figure — how much is coming in vs. going
// out, before they cancel each other out. The net can hide that you still
// owe someone specific even while you're "up" overall.
export function balanceBreakdownForUser(tabs, currentUser) {
  let receivable = 0;
  let owed = 0;
  for (const tab of tabs) {
    for (const s of settlementsForTab(tab)) {
      if (s.status !== 'pending') continue;
      if (s.to === currentUser) receivable += s.amount;
      if (s.from === currentUser) owed += s.amount;
    }
  }
  return { receivable, owed };
}
