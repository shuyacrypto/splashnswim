/** Shared SplashNSwim brand pieces: the wordmark and the wave divider. */

/**
 * The SplashNSwim wordmark, recreated as text so it stays crisp at any size:
 * ocean "Splash", navy "N", coral "Swim". The "light" tone is for dark
 * backgrounds (the footer).
 */
export function Wordmark({
  tone = "brand",
  className = "",
}: {
  tone?: "brand" | "light";
  className?: string;
}) {
  const splash = tone === "light" ? "text-surface" : "text-ocean";
  const n = tone === "light" ? "text-surface" : "text-navy";
  return (
    <span
      className={`font-display font-bold tracking-tight ${className}`}
      aria-label="SplashNSwim"
    >
      <span className={splash}>Splash</span>
      <span className={n}>N</span>
      <span className="text-coral">Swim</span>
    </span>
  );
}

/**
 * A soft wave divider between sections, echoing water. `fillClass` sets the
 * colour of the wave (the section it flows into); `flip` points it upward.
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
      className={`block h-8 w-full ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        className={fillClass}
        d="M0,24 C180,48 360,4 540,12 C760,22 980,48 1200,30 C1320,20 1400,14 1440,18 L1440,48 L0,48 Z"
      />
    </svg>
  );
}
