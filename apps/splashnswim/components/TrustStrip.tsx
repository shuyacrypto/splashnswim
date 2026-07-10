/**
 * A slim band of reassurances shown under the hero. These are brand-level and
 * factual (drawn from SplashNSwim's own description), not invented reviews.
 */
const ITEMS = [
  { label: "1-to-1 only", sub: "Every lesson is private" },
  { label: "Calm private pools", sub: "Eastwood, Benfleet, Rochford" },
  { label: "All ages & abilities", sub: "From babies to adults" },
  { label: "Additional needs welcome", sub: "Patient, tailored teaching" },
];

export function TrustStrip() {
  return (
    <div className="mx-auto -mt-8 max-w-5xl px-5">
      <div className="grid gap-4 rounded-3xl border-2 border-sky bg-surface p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full bg-ocean/10 text-sm font-bold text-ocean">
              ✓
            </span>
            <div>
              <p className="font-display text-sm font-bold text-navy">{item.label}</p>
              <p className="text-xs text-navy/60">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
