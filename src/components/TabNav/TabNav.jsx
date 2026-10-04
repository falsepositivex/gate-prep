const TABS = [
  { id: 'dash',     label: 'Dashboard',    icon: '⬡' },
  { id: 'syllabus', label: 'Syllabus',     icon: '📋' },
  { id: 'tests',    label: 'Mock Tests',   icon: '📝' },
  { id: 'util',     label: 'Day Log',      icon: '📅' },
  { id: 'mistakes', label: 'Mistakes',     icon: '⚠' },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav className="tabs" role="tablist">
      {TABS.map(tab => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          aria-selected={active === tab.id}
          className={active === tab.id ? 'active' : ''}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
