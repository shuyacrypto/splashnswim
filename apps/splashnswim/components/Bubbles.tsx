/** Bubbles drifting up through the underwater hero. Purely ambient. */
const BUBBLES = [
  { left: "6%", size: 14, delay: "0s", dur: "7s" },
  { left: "14%", size: 8, delay: "1.6s", dur: "6s" },
  { left: "28%", size: 6, delay: "3s", dur: "7.5s" },
  { left: "40%", size: 10, delay: "0.5s", dur: "8s" },
  { left: "62%", size: 7, delay: "2.2s", dur: "6.5s" },
  { left: "74%", size: 16, delay: "1s", dur: "8.5s" },
  { left: "86%", size: 9, delay: "3.4s", dur: "7s" },
  { left: "94%", size: 6, delay: "0.9s", dur: "6s" },
];

export function Bubbles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="animate-rise absolute bottom-24 rounded-full bg-white/30 ring-1 ring-white/20"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
            animationDuration: b.dur,
          }}
        />
      ))}
    </div>
  );
}
