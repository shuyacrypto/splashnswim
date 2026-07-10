/** Angled shafts of sunlight filtering down through the water. Ambient only. */
export function LightRays() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute -top-16 left-0 h-[130%] w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.35" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="180,-40 300,-40 150,940 20,940" fill="url(#ray)" />
        <polygon points="560,-40 640,-40 500,940 400,940" fill="url(#ray)" />
        <polygon points="980,-40 1120,-40 1280,940 1120,940" fill="url(#ray)" />
        <polygon points="1240,-40 1320,-40 1420,940 1330,940" fill="url(#ray)" />
      </svg>
    </div>
  );
}
