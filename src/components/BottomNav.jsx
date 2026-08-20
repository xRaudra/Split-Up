import { Home, PlusCircle, Clock, User } from 'lucide-react';

// Mirrors src/assets/splits-icon.svg - kept inline (rather than imported
// directly) so it can take size/color/strokeWidth props like the lucide
// icons it sits next to in the nav bar.
function SplitsIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  // The source art's viewBox is 38x36, not lucide's usual 24x24, so the
  // incoming strokeWidth (calibrated for a 24-unit box) needs scaling up
  // to land at the same rendered pixel thickness as the icons beside it.
  return (
    <svg width={size} height={size} viewBox="0 0 38 36" fill="none" stroke={color} strokeWidth={strokeWidth * (38 / 24)} strokeLinejoin="round">
      <path d="M9.18178 17.777L0.75 11.4527V0.75L16.3176 12.4257V23.1284L0.75 34.8041V24.1014L9.18178 17.777ZM16.3176 12.4257L9.18178 17.777" />
      <path d="M28.4533 17.777L36.8851 11.4527V0.75L21.3176 12.4257V23.1284L36.8851 34.8041V24.1014L28.4533 17.777ZM21.3176 12.4257L28.4533 17.777" />
    </svg>
  );
}

const leftTabs = [
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'tabs', label: 'Splits', Icon: SplitsIcon },
];
const rightTabs = [
  { key: 'history', label: 'History', Icon: Clock },
  { key: 'profile', label: 'Profile', Icon: User },
];

const PAGE_BG = '#F8FAFC';
const BUTTON_SIZE = 68;
const NOTCH_SIZE = BUTTON_SIZE + 4;

function NavIcon({ tab, active, onNavigate }) {
  const isActive = active === tab.key;
  return (
    <button
      onClick={() => onNavigate(tab.key)}
      className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl transition-all active:scale-95"
      style={{ minWidth: 52 }}
    >
      <tab.Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} color={isActive ? '#4F46E5' : '#9CA3AF'} />
      <span className="text-[11px] font-medium" style={{ color: isActive ? '#4F46E5' : '#6B7280', lineHeight: '13px' }}>
        {tab.label}
      </span>
    </button>
  );
}

export default function BottomNav({ active, onNavigate }) {
  return (
    <div
      className="relative flex items-center justify-around px-2 shrink-0"
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #E5E7EB',
        height: 83,
        paddingTop: 4,
        paddingBottom: 24,
        boxSizing: 'border-box',
      }}
    >
      {leftTabs.map((tab) => (
        <NavIcon key={tab.key} tab={tab} active={active} onNavigate={onNavigate} />
      ))}

      {/* Reserves the middle slot's width so the side icons keep their spacing */}
      <div style={{ minWidth: 52 }} aria-hidden="true" />

      {rightTabs.map((tab) => (
        <NavIcon key={tab.key} tab={tab} active={active} onNavigate={onNavigate} />
      ))}

      {/* Notch — an ellipse in the page background color, erasing a bite out of the bar's top edge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -(NOTCH_SIZE / 2),
          left: '50%',
          transform: 'translateX(-50%)',
          width: NOTCH_SIZE,
          height: NOTCH_SIZE,
          borderRadius: '50%',
          background: PAGE_BG,
        }}
      />

      {/* Add Bill — floats in the notch */}
      <button
        onClick={() => onNavigate('addBill')}
        aria-label="Add Bill"
        className="flex items-center justify-center rounded-full transition-all active:scale-95"
        style={{
          position: 'absolute',
          top: -(BUTTON_SIZE / 2),
          left: '50%',
          transform: 'translateX(-50%)',
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          background: '#4F46E5',
          boxShadow: '0 6px 18px rgba(79,70,229,0.45)',
        }}
      >
        <PlusCircle size={30} strokeWidth={2} color="#FFFFFF" />
      </button>
    </div>
  );
}
