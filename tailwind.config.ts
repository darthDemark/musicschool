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
        ivory: "#F7F4EE",
        sand: "#EFE8DC",
        charcoal: "#111111",
        ink: "#1F1F1F",
        muted: "#666666",
        brass: "#C49B3D",
        burgundy: "#6D1F2A",
        line: "#D8CFC0",
        success: "#7A9B76",
        amber: "#B8860B",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(31,31,31,0.04), 0 4px 16px rgba(31,31,31,0.05)",
        "card-hover": "0 2px 4px rgba(31,31,31,0.06), 0 8px 28px rgba(31,31,31,0.08)",
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
