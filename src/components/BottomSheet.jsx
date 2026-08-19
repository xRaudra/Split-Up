import { X } from 'lucide-react';

export default function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: 'rgba(17,24,39,0.45)' }} onClick={onClose} />
      <div
        className="relative bg-white rounded-t-2xl px-5 pt-5 flex flex-col gap-4 fade-in"
        style={{ maxHeight: '82%', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between shrink-0">
          <span className="font-semibold text-[17px] text-[#111827]">{title}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center rounded-full"
            style={{ width: 28, height: 28, background: '#F4F5F7' }}
          >
            <X size={15} color="#6B7280" />
          </button>
        </div>
        <div className="overflow-y-auto hide-scrollbar flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
