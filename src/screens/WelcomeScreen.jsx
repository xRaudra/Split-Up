import { ArrowUpRight } from 'lucide-react';
import Logo from '../components/Logo';

const footerLinks = [
  { label: 'Github Link', href: 'https://github.com/xRaudra/Split-Up' },
  { label: 'App Link', href: 'https://splitupapp.vercel.app' },
  { label: 'Notes', href: '#' },
];

export default function WelcomeScreen({ onNavigate }) {
  return (
    <div className="flex flex-col h-full px-4 pt-[150px] pb-5 fade-in overflow-y-auto hide-scrollbar" style={{ background: '#F8FAFC' }}>
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <Logo size={82} />

        <div className="flex flex-col items-center gap-3.5 mt-[45px] px-4">
          <h1 className="text-[36px] font-normal leading-none" style={{ color: '#4F46E5', letterSpacing: '-0.05em' }}>
            Split Up
          </h1>
          <p className="text-center text-[16px] leading-snug" style={{ color: '#8F8F8F', letterSpacing: '-0.02em' }}>
            Split expenses effortlessly&nbsp;&nbsp;and settle up smartly with friends and groups
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 mt-16 w-full">
        <button
          onClick={() => onNavigate('home')}
          className="w-full max-w-[281px] h-[50px] rounded-[10px] font-medium text-[18px] text-white"
          style={{
            background: '#4F46E5',
            boxShadow: '0 3px 3px rgba(0,0,0,0.10), 0 12px 6px rgba(0,0,0,0.09), 0 27px 8px rgba(0,0,0,0.02)',
            letterSpacing: '-0.02em',
          }}
        >
          Get Started
        </button>
        <span className="text-sm" style={{ color: '#A9A9A9', letterSpacing: '-0.02em' }}>Version 1.0.0</span>
      </div>

      <div style={{ height: 64 }} />

      <div className="flex items-center justify-center gap-6 pb-1">
        {footerLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-0.5 text-[16px] font-normal"
            style={{ color: '#4F46E5', letterSpacing: '-0.02em' }}
          >
            {label}
            <ArrowUpRight size={14} strokeWidth={2} />
          </a>
        ))}
      </div>
    </div>
  );
}
