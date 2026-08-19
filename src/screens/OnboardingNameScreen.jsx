import { useState } from 'react';
import Logo from '../components/Logo';
import Button from '../components/Button';

export default function OnboardingNameScreen({ onSubmit }) {
  const [name, setName] = useState('');
  const trimmed = name.trim();

  function handleSubmit(e) {
    e.preventDefault();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <div className="flex flex-col h-full px-6 pt-[110px] pb-8 fade-in" style={{ background: '#F8FAFC' }}>
      <div className="flex flex-col items-center">
        <Logo size={64} />
        <h1 className="text-[26px] font-medium text-center mt-8" style={{ color: '#111827', letterSpacing: '-0.02em' }}>
          What should we call you?
        </h1>
        <p className="text-center text-[15px] leading-snug mt-2" style={{ color: '#6B7280' }}>
          This is how you'll show up to friends when you split a bill together.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="h-14 px-5 rounded-[10px] text-[18px] font-medium text-center outline-none placeholder:text-[#9CA3AF] placeholder:font-normal"
          style={{ background: '#FFFFFF', border: '1.5px solid #E5E7EB' }}
        />
        <Button type="submit" variant="primary" disabled={!trimmed} className="w-full">
          Continue
        </Button>
      </form>

      <div className="flex-1" />

      <span className="text-center text-xs" style={{ color: '#9CA3AF' }}>
        Nothing is saved to an account — this stays on your device for this session.
      </span>
    </div>
  );
}
