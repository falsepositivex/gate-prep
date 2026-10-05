import { motion } from 'framer-motion';

export default function StatCard({ label, value, detail, icon: Icon, children, index = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-card p-3 sm:p-5 relative overflow-hidden group hover:-translate-y-1 hover:border-border-strong transition-all duration-300"
    >
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-2">
        <div className="font-mono text-xs uppercase tracking-wider text-cyan font-medium">{label}</div>
        {Icon && <Icon className="w-4 h-4 text-cyan/50 group-hover:text-cyan transition-colors" />}
      </div>
      
      <div className="font-head text-3xl md:text-4xl font-bold text-white mb-1 leading-tight">{value}</div>
      
      {detail && <div className="text-sm text-text-muted leading-relaxed">{detail}</div>}
      
      {children && <div className="mt-3">{children}</div>}
    </motion.div>
  );
}
