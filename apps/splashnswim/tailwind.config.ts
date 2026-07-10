import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // Scan the admin panel package so its utility classes are generated.
    "../../packages/engine-admin/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: "rgb(var(--color-ocean) / <alpha-value>)",
        "ocean-deep": "rgb(var(--color-ocean-deep) / <alpha-value>)",
        navy: "rgb(var(--color-navy) / <alpha-value>)",
        coral: "rgb(var(--color-coral) / <alpha-value>)",
        "coral-deep": "rgb(var(--color-coral-deep) / <alpha-value>)",
        blossom: "rgb(var(--color-blossom) / <alpha-value>)",
        sunshine: "rgb(var(--color-sunshine) / <alpha-value>)",
        sky: "rgb(var(--color-sky) / <alpha-value>)",
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
    },
  },
  plugins: [],
} satisfies Config;
