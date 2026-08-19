// No mock data, no persistence — everything here operates on whatever the
// user creates in a session. State lives in App.jsx (React state only), so
// closing the tab clears it; nothing is written to storage or a server.

function sumShares(bills, person) {
  return bills.reduce((sum, b) => sum + (b.shares[person] || 0), 0);
}

export function billsTotal(bills) {
  return bills.reduce((sum, b) => sum + b.total, 0);
}

// Shows "You" for the current user, their real name for everyone else —
// avoids the odd "Ananya owes Ananya" framing you'd otherwise get.
export function displayName(name, currentUser) {
  return name === currentUser ? 'You' : name;
}

// Who owes `currentUser` what, per tab (currentUser assumed payer on all
// bills for this MVP — no per-bill payer selection yet).
export function settlementsForTab(tab, currentUser) {
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

export function totalOwedToUser(tabs, currentUser) {
  return tabs
    .flatMap((t) => settlementsForTab(t, currentUser))
    .filter((s) => s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);
}
