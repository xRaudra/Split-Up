export default function PhoneFrame({ children }) {
  return (
    <div className="phone-outer">
      <div className="phone-inner" style={{ background: '#F8FAFC' }}>
        {children}
      </div>
    </div>
  );
}
