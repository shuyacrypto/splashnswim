/** Shared SplashNSwim brand + animated water pieces. */

export function Logo({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/logo-horizontal.png" alt="SplashNSwim" className={`w-auto ${className}`} />
  );
}

/** The white wordmark, for dark backgrounds (e.g. the footer). */
export function WordmarkLight({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/wordmark-white.png" alt="SplashNSwim" className={`w-auto ${className}`} />
  );
}

const WAVE =
  "M0,70 C 180,30 540,110 720,70 C 900,30 1260,110 1440,70 C 1620,30 1980,110 2160,70 C 2340,30 2700,110 2880,70 L2880,140 L0,140 Z";

/**
 * Animated waves that sit at the bottom of a coloured section and flow into
 * the next one. Two layers drift in opposite directions for depth.
 */
export function Waves({ colorClass = "text-surface", className = "" }: { colorClass?: string; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden sm:h-24 ${colorClass} ${className}`} aria-hidden>
      <svg className="wave-b absolute bottom-0 left-0 h-full w-[200%]" viewBox="0 0 2880 140" preserveAspectRatio="none" fill="currentColor" opacity="0.55">
        <path d={WAVE} />
      </svg>
      <svg className="wave-a absolute bottom-0 left-0 h-full w-[200%]" viewBox="0 0 2880 140" preserveAspectRatio="none" fill="currentColor">
        <path d={WAVE} />
      </svg>
    </div>
  );
}

/** Bubbles drifting up. Ambient. */
const BUBBLES = [
  { left: "8%", size: 14, delay: "0s", dur: "7s" },
  { left: "18%", size: 8, delay: "1.4s", dur: "6s" },
  { left: "30%", size: 6, delay: "2.6s", dur: "7.5s" },
  { left: "44%", size: 11, delay: "0.6s", dur: "8s" },
  { left: "60%", size: 7, delay: "2s", dur: "6.5s" },
  { left: "72%", size: 15, delay: "1s", dur: "8.5s" },
  { left: "85%", size: 9, delay: "3.2s", dur: "7s" },
  { left: "93%", size: 6, delay: "0.9s", dur: "6s" },
];

export function Bubbles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="animate-bubble absolute bottom-24 rounded-full bg-surface/25 ring-1 ring-surface/20"
          style={{ left: b.left, width: b.size, height: b.size, animationDelay: b.delay, animationDuration: b.dur }}
        />
      ))}
    </div>
  );
}

/** Shifting caustic light, like sun through water. */
export function Caustics() {
  return (
    <div
      aria-hidden
      className="animate-caustic pointer-events-none absolute inset-0 opacity-70"
      style={{
        background:
          "radial-gradient(50% 42% at 80% 12%, rgb(var(--color-aqua) / 0.38), transparent 62%), radial-gradient(42% 38% at 60% 34%, rgb(var(--color-surface) / 0.12), transparent 58%)",
      }}
    />
  );
}
