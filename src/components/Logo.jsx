export default function Logo({ size = 105 }) {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * (18 / 105),
        background: '#4F46E5',
        boxShadow: '0 3px 3px rgba(0,0,0,0.10), 0 12px 6px rgba(0,0,0,0.09), 0 27px 8px rgba(0,0,0,0.02)',
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 105 105" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M37.6743 51.7103L24.6094 41.9109V25.3273L48.731 43.4185V60.0021L24.6094 78.0933V61.5097L37.6743 51.7103ZM48.731 43.4185L37.6743 51.7103"
          stroke="white" strokeWidth="3" strokeLinejoin="round"
        />
        <path
          d="M67.3257 53.6352L80.3906 43.8358V27.2521L56.269 45.3434V61.927L80.3906 80.0182V63.4346L67.3257 53.6352ZM56.269 45.3434L67.3257 53.6352"
          stroke="white" strokeWidth="3" strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
