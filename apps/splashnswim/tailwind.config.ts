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
        ocean: "var(--color-ocean)",
        "ocean-deep": "var(--color-ocean-deep)",
        navy: "var(--color-navy)",
        coral: "var(--color-coral)",
        "coral-deep": "var(--color-coral-deep)",
        blossom: "var(--color-blossom)",
        sunshine: "var(--color-sunshine)",
        sky: "var(--color-sky)",
        surface: "var(--color-surface)",
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
