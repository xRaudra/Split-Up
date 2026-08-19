import { useState } from 'react';
import { Camera, Keyboard } from 'lucide-react';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

export default function AddBillScreen({ onNavigate, presetTabId }) {
  const [scanning, setScanning] = useState(false);

  if (scanning) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 px-8 text-center screen-enter" style={{ background: '#111827' }}>
        <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.08)' }}>
          <Camera size={28} color="#FFFFFF" />
        </div>
        <span className="font-semibold text-white text-[16px]">Scanning isn't wired up in this prototype</span>
        <span className="text-sm" style={{ color: '#9CA3AF' }}>In the real app, this camera view reads the bill total automatically. For now, continue manually.</span>
        <Button variant="primary" className="w-full mt-2" onClick={() => onNavigate('addBillManual', { tabId: presetTabId })}>
          Continue Manually
        </Button>
        <button onClick={() => setScanning(false)} className="text-sm font-semibold" style={{ color: '#9CA3AF' }}>Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title="Add Bill" onBack={() => onNavigate(presetTabId ? 'tabDetail' : 'home', { tabId: presetTabId })} />
      <div className="flex-1 px-5 pt-4 flex flex-col gap-4 screen-enter">
        <span className="text-sm text-[#6B7280] mb-1">How do you want to add this bill?</span>

        <button
          onClick={() => setScanning(true)}
          className="flex items-start gap-4 px-5 py-5 rounded-xl text-left bg-white"
          style={{ border: '1.5px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 44, height: 44, background: '#EEF2FF' }}>
            <Camera size={22} color="#4F46E5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-[16px] text-[#111827]">Scan Bill</span>
            <span className="text-[13px] text-[#6B7280]">Snap a photo and we'll read the total</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('addBillManual', { tabId: presetTabId })}
          className="flex items-start gap-4 px-5 py-5 rounded-xl text-left bg-white"
          style={{ border: '1.5px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 44, height: 44, background: '#EEF2FF' }}>
            <Keyboard size={22} color="#4F46E5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-[16px] text-[#111827]">Enter Manually</span>
            <span className="text-[13px] text-[#6B7280]">Type in the amount and split it yourself</span>
          </div>
        </button>
      </div>
    </div>
  );
}
