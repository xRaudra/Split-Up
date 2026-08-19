import { Home, Wallet, PlusCircle, Clock, User } from 'lucide-react';

const tabs = [
  { key: 'home',    label: 'Home',     Icon: Home },
  { key: 'tabs',    label: 'Tabs',     Icon: Wallet },
  { key: 'addBill', label: 'Add Bill', Icon: PlusCircle, primary: true },
  { key: 'history', label: 'History',  Icon: Clock },
  { key: 'profile', label: 'Profile',  Icon: User },
];

export default function BottomNav({ active, onNavigate }) {
  return (
    <div
      className="flex items-center justify-around px-2"
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #E5E7EB',
        height: 49,
        flexShrink: 0,
      }}
    >
      {tabs.map(({ key, label, Icon, primary }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all active:scale-95"
            style={{ minWidth: 52 }}
          >
            {primary ? (
              <div
                className="flex items-center justify-center rounded-full -mt-6 mb-0.5"
                style={{
                  width: 44, height: 44,
                  background: '#4F46E5',
                  boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
                }}
              >
                <Icon size={22} strokeWidth={2} color="#FFFFFF" />
              </div>
            ) : (
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} color={isActive ? '#4F46E5' : '#9CA3AF'} />
            )}
            <span
              className="text-[11px] font-medium"
              style={{ color: isActive || primary ? '#4F46E5' : '#6B7280' }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
