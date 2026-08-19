import { Plane, Home, PartyPopper, User } from 'lucide-react';

export const TAB_TYPES = [
  { key: 'trip', label: 'Trip', Icon: Plane },
  { key: 'household', label: 'Household', Icon: Home },
  { key: 'event', label: 'Event', Icon: PartyPopper },
  { key: 'personal', label: 'Personal', Icon: User },
];

export function tabTypeFor(key) {
  return TAB_TYPES.find((t) => t.key === key) || null;
}
