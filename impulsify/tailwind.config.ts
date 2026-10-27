import type { Config } from "tailwindcss";

// Impulsify design tokens. Colours mirror the CSS variables in globals.css.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: { xs: "390px", sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px" },
    extend: {
      colors: {
        ink: "#111318", // Midnight Black
        graphite: "#202329",
        graphite2: "#2A2E36",
        volt: "#C7FF46", // Electric Volt Lime
        violet: "#8A76FF", // Electric Violet
        paper: "#F6F7F3", // Soft White
        snow: "#F8F9FA",
        mist: "#A6ABB3", // Cool Gray
        line: "rgba(166,171,179,0.18)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.055em", tighter2: "-0.035em" },
      borderRadius: { card: "18px" },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translate3d(0,0,0)" }, "50%": { transform: "translate3d(0,-14px,0)" } },
        marquee: { from: { transform: "translate3d(0,0,0)" }, to: { transform: "translate3d(-50%,0,0)" } },
        pop: { "0%": { transform: "scale(1)" }, "40%": { transform: "scale(1.35)" }, "100%": { transform: "scale(1)" } },
        rise: { from: { transform: "translate3d(0,110%,0)" }, to: { transform: "translate3d(0,0,0)" } },
        fadeUp: { from: { opacity: "0", transform: "translate3d(0,16px,0)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        pop: "pop 420ms cubic-bezier(0.34,1.56,0.64,1)",
        rise: "rise 900ms cubic-bezier(0.22,1,0.36,1) both",
        "fade-up": "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
