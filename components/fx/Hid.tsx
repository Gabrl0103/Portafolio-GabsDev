/** Detalles ocultos que solo revela la linterna del cursor. */

function koiDots() {
  const dots: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < 22; i++) {
    const u = i / 21;
    const x = 4 + u * 26;
    const wd = 4.2 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.65)), 0.8) * (1 - 0.25 * u);
    for (let k = -1; k <= 1; k += 0.5) {
      if (Math.abs(k) < 1 && wd < 1.2) continue;
      dots.push({ x: +x.toFixed(1), y: +(10 + k * wd).toFixed(1), r: +(0.55 + 0.25 * (1 - Math.abs(k))).toFixed(2) });
    }
  }
  for (let i = 0; i < 9; i++) {
    const a = (i / 8 - 0.5) * 1.1;
    dots.push({ x: +(30 + Math.cos(a) * 7).toFixed(1), y: +(10 + Math.sin(a) * 7).toFixed(1), r: 0.6 });
  }
  return dots;
}
const KOI = koiDots();

export function Koi({ w }: { w: number }) {
  return (
    <svg width={w} height={w / 2} viewBox="0 0 40 20" aria-hidden="true">
      {KOI.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} />
      ))}
    </svg>
  );
}

export default function Hid({ x, y, children }: { x: string; y: string; children: React.ReactNode }) {
  return (
    <span className="hid" aria-hidden="true" style={{ left: x, top: y }}>
      {children}
    </span>
  );
}
