const TINTS = [
  { bg: '#EEF2FF', fg: '#4338CA' },
  { bg: '#FEF3C7', fg: '#92400E' },
  { bg: '#DCFCE7', fg: '#166534' },
  { bg: '#FCE7F3', fg: '#9D174D' },
];

function tintFor(seed) {
  const code = String(seed).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return TINTS[code % TINTS.length];
}

export default function Avatar({ name, size = 36, selected = false }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const tint = tintFor(name);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="flex items-center justify-center rounded-full font-semibold"
        style={{
          width: size, height: size,
          background: tint.bg, color: tint.fg,
          fontSize: Math.round(size * 0.36),
          border: selected ? '2px solid #4F46E5' : 'none',
        }}
      >
        {initials}
      </div>
      {selected && (
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{
            width: 16, height: 16, right: -4, bottom: -4,
            background: '#4F46E5', border: '2px solid #FFFFFF',
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 4L3 6L7 1.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}
