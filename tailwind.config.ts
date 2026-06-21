import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hit Camp dark studio system. Legacy token names are kept and remapped
        // to dark-theme values so the whole app reskins without per-element edits.
        studio: "#070707",
        studio2: "#0D0D0D",
        ivory: "#F5F5F0", // primary light text / on-dark
        sand: "#16161A", // subtle elevated dark panel
        charcoal: "#0D0D0D", // dark surface + text on gold
        ink: "#F5F5F0", // primary text (now light)
        muted: "#A8A8A8",
        brass: "#D4AF37", // gold accent
        burgundy: "#F0C36A", // warm accent (remapped from old red)
        line: "#2A2A2A",
        success: "#7A9B76",
        amber: "#E0A852",
        gold: "#D4AF37",
        warm: "#F0C36A",
      },
      fontFamily: {
        // Sans-only system. `serif` is intentionally aliased to Inter so existing
        // `font-serif` headings render as clean sans without editing every page.
        serif: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.45)",
        "card-hover": "0 2px 6px rgba(0,0,0,0.5), 0 16px 40px rgba(0,0,0,0.55)",
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
