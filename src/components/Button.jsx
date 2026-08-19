const variants = {
  primary: 'bg-[#4F46E5] text-white active:bg-[#3730A3] disabled:bg-[#C7D2FE] disabled:text-white',
  secondary: 'bg-white text-[#111827] border border-[#E5E7EB] active:bg-[#F4F5F7] disabled:text-[#9CA3AF]',
  tertiary: 'bg-transparent text-[#4F46E5] active:bg-[#EEF2FF] disabled:text-[#9CA3AF]',
  destructive: 'bg-[#DC2626] text-white active:bg-[#B91C1C] disabled:bg-[#FCA5A5]',
};

export default function Button({ variant = 'primary', children, className = '', ...props }) {
  return (
    <button
      className={`h-12 px-5 rounded-[10px] font-semibold text-[15px] transition-colors flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
