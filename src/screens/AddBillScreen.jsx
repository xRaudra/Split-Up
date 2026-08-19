import { useState } from 'react';
import { Camera } from 'lucide-react';
import TopBar from '../components/TopBar';
import Input from '../components/Input';
import AmountInput from '../components/AmountInput';
import Button from '../components/Button';

export default function AddBillScreen({ onNavigate, presetTabId, initialBillName = '', initialAmount = '' }) {
  const [scanning, setScanning] = useState(false);
  const [billName, setBillName] = useState(initialBillName);
  const [amount, setAmount] = useState(initialAmount);

  const amountNum = Number(amount) || 0;
  const canContinue = billName.trim() && amountNum > 0;

  function handleContinue() {
    onNavigate('addBillSplit', { tabId: presetTabId, billName: billName.trim(), amount });
  }

  if (scanning) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 px-5 text-center screen-enter" style={{ background: '#111827' }}>
        <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.08)' }}>
          <Camera size={28} color="#FFFFFF" />
        </div>
        <span className="font-semibold text-white text-[16px]">Scanning isn't wired up in this prototype</span>
        <span className="text-sm" style={{ color: '#9CA3AF' }}>In the real app, this camera view reads the bill name and total automatically. For now, continue by typing them in.</span>
        <Button variant="primary" className="w-full mt-2" onClick={() => setScanning(false)}>
          Continue Manually
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8FAFC' }}>
      <TopBar title="Add Bill" onBack={() => onNavigate(presetTabId ? 'tabDetail' : 'home', { tabId: presetTabId })} />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-8 flex flex-col gap-5 screen-enter">
        <Input label="Bill Name" placeholder="e.g. Dinner at Beach Shack" value={billName} onChange={(e) => setBillName(e.target.value)} />
        <AmountInput label="Amount" value={amount} onChange={setAmount} onScanClick={() => setScanning(true)} />

        <div className="flex-1" />

        <Button variant="primary" className="w-full" disabled={!canContinue} onClick={handleContinue}>
          Who's Splitting?
        </Button>
      </div>
    </div>
  );
}
