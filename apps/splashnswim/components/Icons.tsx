/**
 * A small set of premium line icons for SplashNSwim. One consistent style:
 * 24x24 grid, no fill, currentColor stroke, rounded caps. Size and colour come
 * from Tailwind classes on the element (for example "h-6 w-6 text-ocean").
 */
import type { SVGProps } from "react";

function base(props: SVGProps<SVGSVGElement>) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

/** One-to-one teaching: a teacher and a learner side by side. */
export function IconOneToOne(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="8" r="2.6" />
      <circle cx="16.5" cy="9.5" r="2.1" />
      <path d="M3.5 19a4.5 4.5 0 0 1 9 0" />
      <path d="M13.6 19a3.6 3.6 0 0 1 6.9-1.4" />
    </svg>
  );
}

/** Location: a map pin for the pools. */
export function IconPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

/** Progress through levels: ascending bars. */
export function IconLevels(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base({ strokeWidth: 2.4, ...props })}>
      <path d="M5 20v-3.5" />
      <path d="M12 20v-8" />
      <path d="M19 20v-12.5" />
    </svg>
  );
}

/** Care and additional needs: a heart. */
export function IconHeart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M12 20s-6.5-4.4-6.5-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 6.5 2.8C18.5 15.6 12 20 12 20z" />
    </svg>
  );
}

/** Qualified and safe: a shield with a check. */
export function IconShield(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l7 2.6v4.9c0 4.4-3 7.4-7 8.5-4-1.1-7-4.1-7-8.5V5.6z" />
      <path d="M9 11.8l2 2 4-4.2" />
    </svg>
  );
}

/** A fine check, used inside a tinted disc for feature lists. */
export function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base({ strokeWidth: 2.4, ...props })}>
      <path d="M5 12.5l4 4 10-10.5" />
    </svg>
  );
}
