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
        studio: "#050505", // page background
        studio2: "#080808",
        surface: "#111111",
        elevated: "#151515", // elevated cards
        ivory: "#F5F5F0", // primary light text / on-dark
        sand: "#141416", // subtle elevated dark panel
        charcoal: "#0D0D0D", // sidebar / dark surface + text on gold
        ink: "#F5F5F0", // primary text
        muted: "#B5B5B5", // secondary text
        faint: "#7A7A7A", // muted text
        brass: "#D4AF37", // gold accent
        burgundy: "#F0C36A", // warm accent
        line: "#1E1E1E",
        success: "#7A9B76",
        amber: "#E0A852",
        gold: "#D4AF37",
        warm: "#F0C36A",
        goldcta: "#E2B93B", // bright gold CTA
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
