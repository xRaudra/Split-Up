const styles = {
  pending: { bg: '#FEF3C7', fg: '#92400E', glyph: '●', label: 'Pending' },
  paid:    { bg: '#F0FDF4', fg: '#16A34A', glyph: '✓', label: 'Paid' },
  active:  { bg: '#EEF2FF', fg: '#4F46E5', glyph: '●', label: 'Active' },
  settled: { bg: '#F0FDF4', fg: '#16A34A', glyph: '✓', label: 'Settled' },
  error:   { bg: '#FEF2F2', fg: '#DC2626', glyph: '!', label: 'Error' },
};

export default function StatusBadge({ type, label }) {
  const s = styles[type] || styles.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
      style={{ background: s.bg, color: s.fg }}
    >
      <span aria-hidden="true">{s.glyph}</span>
      {label || s.label}
    </span>
  );
}
