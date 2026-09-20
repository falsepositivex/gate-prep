// Reusable progress bar — renders the amber gradient bar
// pct: 0-100
export default function ProgressBar({ pct }) {
  return (
    <div className="progress-outer">
      <div className="progress-inner" style={{ width: `${pct}%` }} />
    </div>
  );
}
