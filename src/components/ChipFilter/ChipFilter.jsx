import { cn } from '../../lib/utils';

export default function ChipFilter({ options, active, onChange, className }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map(opt => {
        const isActive = active === opt.value;
        return (
          <button
            key={opt.value}
            className={cn(
              "px-4 py-1.5 rounded-full font-mono text-[13px] border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 whitespace-nowrap",
              isActive 
                ? "bg-accent text-[#241300] border-accent font-semibold shadow-[0_0_12px_rgba(235,164,58,0.4)] scale-[1.02]" 
                : "bg-surface-3 text-text-muted border-border-strong hover:bg-surface-2 hover:text-text-main hover:border-text-muted"
            )}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
