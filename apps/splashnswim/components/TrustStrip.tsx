import type { ComponentType, SVGProps } from "react";
import { IconOneToOne, IconPin, IconLevels, IconHeart } from "./Icons";

/** A bright band of reassurances under the hero. Factual, brand-level. */
const ITEMS: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  sub: string;
}[] = [
  { icon: IconOneToOne, label: "One to one, always", sub: "Never a group lesson" },
  { icon: IconPin, label: "Private pools", sub: "Eastwood, Benfleet, Ashingdon" },
  { icon: IconLevels, label: "Every age and ability", sub: "First splash to stroke work" },
  { icon: IconHeart, label: "Additional needs welcome", sub: "Calm, patient teaching" },
];

export function TrustRow() {
  return (
    <div className="border-b border-foam bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-start gap-3.5 border-foam px-5 py-6 [&:not(:last-child)]:border-b sm:px-6 sm:py-8 sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r"
            >
              <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-foam text-ocean-deep">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-base font-bold text-ink">{item.label}</p>
                <p className="mt-0.5 text-sm text-slate">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
