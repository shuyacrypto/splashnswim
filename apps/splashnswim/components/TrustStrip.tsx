/**
 * A quiet band of reassurances under the hero. Factual and brand-level, set as
 * an elegant divided row rather than a card.
 */
const ITEMS = [
  { label: "One to one, always", sub: "Never a group lesson" },
  { label: "Private pools", sub: "Eastwood, Benfleet, Rochford" },
  { label: "Every age and ability", sub: "First splash to stroke work" },
  { label: "Additional needs welcome", sub: "Calm, patient teaching" },
];

export function TrustRow() {
  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-4">
        {ITEMS.map((item) => (
          <div
            key={item.label}
            className="border-line px-5 py-6 [&:not(:last-child)]:border-b sm:px-8 sm:py-8 sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r"
          >
            <p className="font-display text-base text-ink">{item.label}</p>
            <p className="mt-1 text-sm text-slate">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
