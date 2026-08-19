import { Bell } from 'lucide-react';
import Avatar from './Avatar';

export default function HomeHero({ currentUser, amount, badge }) {
  const firstName = currentUser.split(' ')[0];
  return (
    <div style={{ background: '#4F46E5', height: 400 }} className="shrink-0 flex flex-col">
      <div className="flex items-center gap-2.5 px-5 pt-5">
        <Avatar name={currentUser} size={44} />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Small: 12px Inter Medium */}
          <span className="text-white font-medium" style={{ fontSize: 12 }}>Hey {firstName},</span>
          {/* Small: 12px Inter Regular (Design System has no step below 12px) */}
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
        {/* Body Medium: 16px Inter Medium */}
        <span className="text-white text-center" style={{ fontSize: 16, fontWeight: 500 }}>Main - RUP</span>
        {/* Display Amount: 32px Inter Bold — "the ₹ amount, always", per the Design System's Type Section */}
        <span className="text-white font-bold text-center" style={{ fontSize: 32 }}>{amount}</span>
        <div
          className="flex items-center rounded-full"
          style={{ background: '#6B6EEA', padding: '16px 24px', borderRadius: 35 }}
        >
          {/* Caption: 14px Inter Regular */}
          <span className="text-white" style={{ fontSize: 14 }}>{badge}</span>
        </div>
      </div>
    </div>
  );
}
