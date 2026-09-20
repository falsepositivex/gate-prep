// Reusable chip-button filter bar
// options: [{ value, label }]
// active: current value
// onChange: (value) => void
export default function ChipFilter({ options, active, onChange }) {
  return (
    <div className="chip-filter">
      {options.map(opt => (
        <button
          key={opt.value}
          className={active === opt.value ? 'on' : ''}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
