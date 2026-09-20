// SVG line chart for mock test score trends
// tests: sorted chronological array of { score, max, date }
export default function ScoreChart({ tests }) {
  if (tests.length < 2) {
    return <p className="section-note">Log at least two tests to see your trend line.</p>;
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

  const gridLines = [0, 25, 50, 75, 100].map(v => {
    const y = padT + (h - padT - padB) * (1 - v / 100);
    return (
      <g key={v}>
        <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <text x={2} y={y + 4} fontSize={12} fontFamily="IBM Plex Mono, monospace" fill="#9a9da3">{v}</text>
      </g>
    );
  });

  const dots = coords.map((c, i) => (
    <circle key={i} cx={c[0]} cy={c[1]} r={3.5} fill="#eba43a" />
  ));

  return (
    <div className="chart-wrap">
      <h2 className="section-title" style={{ fontSize: '17.5px' }}>Score trend (%)</h2>
      <svg className="linechart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {gridLines}
        <path d={pathD} fill="none" stroke="#eba43a" strokeWidth="2.5" />
        {dots}
      </svg>
    </div>
  );
}
