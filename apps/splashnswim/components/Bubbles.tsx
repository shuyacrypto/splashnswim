/** Decorative bubbles that drift up through the hero. Purely ambient. */
const BUBBLES = [
  { left: "6%", size: 12, delay: "0s", dur: "7s" },
  { left: "16%", size: 7, delay: "1.6s", dur: "6s" },
  { left: "38%", size: 5, delay: "3s", dur: "7.5s" },
  { left: "78%", size: 13, delay: "0.7s", dur: "8s" },
  { left: "88%", size: 8, delay: "2.3s", dur: "6.5s" },
];

export function Bubbles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="animate-rise absolute bottom-16 rounded-full bg-ocean/20"
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
