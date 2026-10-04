import { LayoutDashboard, BookOpen, ClipboardList, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'dash',     label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'syllabus', label: 'Syllabus',     icon: BookOpen },
  { id: 'tests',    label: 'Mock Tests',   icon: ClipboardList },
  { id: 'util',     label: 'Day Log',      icon: Calendar },
  { id: 'mistakes', label: 'Mistakes',     icon: AlertTriangle },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav className="glass-panel p-2 flex items-center justify-between gap-1 shadow-2xl shadow-black/50" role="tablist">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors duration-200 outline-none
              ${isActive ? 'text-accent' : 'text-text-muted hover:text-text-main hover:bg-white/5'}
            `}
            onClick={() => onChange(tab.id)}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-accent/15 rounded-lg border border-accent/20"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className={`w-5 h-5 mb-1 relative z-10 ${isActive ? 'opacity-100' : 'opacity-70'}`} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide uppercase relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
