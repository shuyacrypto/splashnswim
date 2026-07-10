/** A bright band of reassurances under the hero. Factual, brand-level. */
const ITEMS = [
  { label: "One to one, always", sub: "Never a group lesson" },
  { label: "Private pools", sub: "Eastwood, Benfleet, Rochford" },
  { label: "Every age and ability", sub: "First splash to stroke work" },
  { label: "Additional needs welcome", sub: "Calm, patient teaching" },
];

function Tick() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="h-5 w-5 flex-none text-ocean" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export function TrustRow() {
  return (
    <div className="border-b border-foam bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-4">
        {ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 border-foam px-5 py-6 [&:not(:last-child)]:border-b sm:px-6 sm:py-8 sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r"
          >
            <Tick />
            <div>
              <p className="font-display text-base font-bold text-ink">{item.label}</p>
              <p className="mt-0.5 text-sm text-slate">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
