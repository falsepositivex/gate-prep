// Reusable stat card for the dashboard grid
export default function StatCard({ label, value, detail, children }) {
  return (
    <div className="stat-card">
      <div className="k">{label}</div>
      <div className="v">{value}</div>
      {detail && <div className="d">{detail}</div>}
      {children}
    </div>
  );
}
