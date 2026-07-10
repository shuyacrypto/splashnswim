import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/engine-admin/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: "rgb(var(--color-ocean) / <alpha-value>)",
        "ocean-deep": "rgb(var(--color-ocean-deep) / <alpha-value>)",
        abyss: "rgb(var(--color-abyss) / <alpha-value>)",
        aqua: "rgb(var(--color-aqua) / <alpha-value>)",
        foam: "rgb(var(--color-foam) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        slate: "rgb(var(--color-slate) / <alpha-value>)",
        coral: "rgb(var(--color-coral) / <alpha-value>)",
        "coral-deep": "rgb(var(--color-coral-deep) / <alpha-value>)",
        sunshine: "rgb(var(--color-sunshine) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-rounded", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-rounded", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      letterSpacing: { eyebrow: "0.18em" },
    },
  },
  plugins: [],
} satisfies Config;
