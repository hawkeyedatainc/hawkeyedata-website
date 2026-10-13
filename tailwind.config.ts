import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { "2xl": "1320px" } },
    extend: {
      colors: {
        night: "rgb(var(--night) / <alpha-value>)",
        violet: "rgb(var(--violet) / <alpha-value>)",
        plum: "rgb(var(--plum) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        lilac: "rgb(var(--lilac) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
      },
      fontFamily: {
        display: ['"Unbounded Variable"', "ui-sans-serif", "sans-serif"],
        sans: ['"Onest Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
} satisfies Config;
