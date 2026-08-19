import { Bell, HelpCircle, Shield, ChevronRight, LogOut } from 'lucide-react';
import Avatar from '../components/Avatar';
import { currentUser } from '../data/mockData';

const rows = [
  { icon: Bell, label: 'Notifications' },
  { icon: Shield, label: 'Privacy & Security' },
  { icon: HelpCircle, label: 'Help & FAQ' },
];

export default function ProfileScreen() {
  return (
    <div className="flex flex-col h-full overflow-y-auto hide-scrollbar screen-enter" style={{ background: '#F8FAFC' }}>
      <div className="flex flex-col items-center gap-3 px-5 pt-8 pb-6">
        <Avatar name={currentUser} size={72} />
        <span className="font-semibold text-[18px] text-[#111827]">{currentUser}</span>
        <span className="text-sm text-[#6B7280]">ananya.rao@example.com</span>
      </div>

      <div className="px-5 flex flex-col gap-2">
        {rows.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-3 px-4 py-3.5 rounded-[10px] bg-white text-left"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <Icon size={18} color="#6B7280" />
            <span className="flex-1 text-sm font-semibold text-[#111827]">{label}</span>
            <ChevronRight size={16} color="#9CA3AF" />
          </button>
        ))}

        <button
          className="flex items-center gap-3 px-4 py-3.5 rounded-[10px] bg-white text-left mt-2"
          style={{ border: '1px solid #E5E7EB' }}
        >
          <LogOut size={18} color="#DC2626" />
          <span className="flex-1 text-sm font-semibold" style={{ color: '#DC2626' }}>Log Out</span>
        </button>
      </div>

      <span className="text-center text-xs text-[#9CA3AF] mt-8 mb-6">Split Up · Product Design Prototype</span>
    </div>
  );
}
