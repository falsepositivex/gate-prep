const TABS = [
  { id: 'dash',     label: 'Dashboard' },
  { id: 'syllabus', label: 'Syllabus Tracker' },
  { id: 'tests',    label: 'Mock Tests' },
  { id: 'log',      label: 'Study Log' },
  { id: 'util',     label: 'Utilization' },
  { id: 'mistakes', label: 'Mistakes' },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav className="tabs">
      {TABS.map(tab => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          className={active === tab.id ? 'active' : ''}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
