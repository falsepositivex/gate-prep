import { motion } from 'framer-motion';

export default function ScoreChart({ tests }) {
  if (tests.length < 2) {
    return <p className="text-sm text-text-muted mt-4 p-4 glass-card text-center">Log at least two tests to see your trend line.</p>;
  }

  const w = 900, h = 210, padL = 34, padB = 26, padT = 14, padR = 10;
  const pts = tests.map(t => Math.round((t.score / t.max) * 100));
  const maxY = 100, minY = 0;
  const stepX = (w - padL - padR) / (pts.length - 1);

  const coords = pts.map((v, i) => {
    const x = padL + i * stepX;
    const y = padT + (h - padT - padB) * (1 - (v - minY) / (maxY - minY));
    return [x, y];
  });

  const pathD = coords
    .map((c, i) => (i === 0 ? 'M' : 'L') + c[0].toFixed(1) + ',' + c[1].toFixed(1))
    .join(' ');
    
  const areaD = `${pathD} L${coords[coords.length - 1][0].toFixed(1)},${h - padB} L${padL},${h - padB} Z`;

  const gridLines = [0, 25, 50, 75, 100].map(v => {
    const y = padT + (h - padT - padB) * (1 - v / 100);
    return (
      <g key={v}>
        <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--color-border-subtle)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={2} y={y + 4} fontSize={10} className="font-mono" fill="var(--color-text-muted)">{v}%</text>
      </g>
    );
  });

  return (
    <div className="mt-8 mb-4">
      <h2 className="font-head font-bold text-lg text-white mb-4">Score trend</h2>
      <div className="w-full overflow-hidden bg-surface-1/50 rounded-xl border border-border-subtle p-2">
        <svg className="w-full h-[210px] overflow-visible" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {gridLines}
          
          <motion.path 
            d={areaD} 
            fill="url(#scoreArea)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          
          <motion.path 
            d={pathD} 
            fill="none" 
            stroke="var(--color-accent)" 
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {coords.map((c, i) => (
            <motion.circle 
              key={i} 
              cx={c[0]} 
              cy={c[1]} 
              r={4} 
              className="fill-surface-1 stroke-accent stroke-[2.5px]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.05, type: "spring" }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
