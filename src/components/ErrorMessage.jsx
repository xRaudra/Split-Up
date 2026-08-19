export default function ErrorMessage({ headline, body }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 rounded-[10px]" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
      <span
        className="flex items-center justify-center rounded-full font-bold text-white text-xs shrink-0 mt-0.5"
        style={{ width: 22, height: 22, background: '#DC2626' }}
      >
        !
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-sm" style={{ color: '#991B1B' }}>{headline}</span>
        <span className="text-[13px]" style={{ color: '#B91C1C' }}>{body}</span>
      </div>
    </div>
  );
}
