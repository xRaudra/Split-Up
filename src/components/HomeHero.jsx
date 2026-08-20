import { Bell, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Avatar from './Avatar';

export default function HomeHero({ currentUser, amount, receivable, owed }) {
  const firstName = currentUser.split(' ')[0];
  return (
    <div style={{ background: '#4F46E5', height: 400 }} className="shrink-0 flex flex-col">
      <div className="flex items-center gap-2.5 px-5 pt-5">
        <Avatar name={currentUser} size={44} />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="text-white font-medium" style={{ fontSize: 16 }}>Hey {firstName},</span>
          <span style={{ fontSize: 12, color: '#E2E8F0' }}>Your Split at glance</span>
        </div>
        <button
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 44, height: 44, background: '#6B6EEA' }}
          aria-label="Notifications"
        >
          <Bell size={22} color="#FFFFFF" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5" style={{ gap: 6 }}>
        <span className="text-white text-center" style={{ fontSize: 16, fontWeight: 600 }}>Main - RUP</span>
        <span className="text-white font-semibold text-center" style={{ fontSize: 51 }}>{amount}</span>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1.5 rounded-full" style={{ background: '#6B6EEA', padding: '8px 14px', borderRadius: 35 }}>
            <ArrowDownLeft size={13} color="#FFFFFF" />
            <span className="text-white" style={{ fontSize: 12 }}>₹{receivable.toLocaleString('en-IN')} to receive</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full" style={{ background: '#6B6EEA', padding: '8px 14px', borderRadius: 35 }}>
            <ArrowUpRight size={13} color="#FFFFFF" />
            <span className="text-white" style={{ fontSize: 12 }}>₹{owed.toLocaleString('en-IN')} to pay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
