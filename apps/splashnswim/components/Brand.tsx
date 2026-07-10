/** Shared SplashNSwim brand pieces: the logo, a text wordmark, and waves. */

/** The real SplashNSwim logo (wordmark + axolotl). Used on light backgrounds. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo.png"
      alt="SplashNSwim"
      className={`w-auto ${className}`}
    />
  );
}

/**
 * A text wordmark for dark backgrounds (the logo's navy parts would vanish
 * there): "Splash" and "N" in white, "Swim" in coral.
 */
export function WordmarkLight({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`} aria-label="SplashNSwim">
      <span className="text-surface">Splash</span>
      <span className="text-surface">N</span>
      <span className="text-coral">Swim</span>
    </span>
  );
}

/**
 * A soft wave divider between sections, echoing water. `fillClass` sets the
 * colour the wave flows into; `flip` points it upward.
 */
export function Wave({
  fillClass = "fill-surface",
  flip = false,
  className = "",
}: {
  fillClass?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      aria-hidden
      className={`block h-8 w-full sm:h-12 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        className={fillClass}
        d="M0,24 C180,48 360,4 540,12 C760,22 980,48 1200,30 C1320,20 1400,14 1440,18 L1440,48 L0,48 Z"
      />
    </svg>
  );
}
