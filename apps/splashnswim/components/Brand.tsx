/** Shared SplashNSwim brand pieces. */

/** The real SplashNSwim logo. Used on light backgrounds. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/logo.png" alt="SplashNSwim" className={`w-auto ${className}`} />
  );
}

/** Elegant text wordmark for dark backgrounds (footer). */
export function WordmarkLight({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display ${className}`} aria-label="SplashNSwim">
      <span className="text-surface">SplashN</span>
      <span className="text-accent">Swim</span>
    </span>
  );
}

/**
 * A quiet water-ripple motif: a few thin horizontal curves. Sits low-opacity
 * behind the hero to give depth without illustration or cartoon.
 */
export function Ripples({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
    >
      {[0, 70, 140, 210, 280, 350, 420, 490].map((y, i) => (
        <path
          key={i}
          d={`M-40 ${120 + y} C 240 ${90 + y}, 480 ${150 + y}, 760 ${120 + y} S 1240 ${90 + y}, 1480 ${120 + y}`}
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.5 - i * 0.045}
        />
      ))}
    </svg>
  );
}
