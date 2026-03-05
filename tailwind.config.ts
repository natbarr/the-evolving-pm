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
        // Primary — warm stone (replaces cold slate)
        primary: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        // Accent — forest green (replaces amber)
        accent: {
          50: "#f0f7f4",
          100: "#e4ede9",
          200: "#c2d9d0",
          300: "#95bfb0",
          400: "#619f8d",
          500: "#3d7a68",
          600: "#2d5a4a",
          700: "#214237",
          800: "#1a3d31",
          900: "#142e25",
          950: "#0a1e18",
        },
        // Semantic color aliases (map to CSS custom properties)
        canvas:          "var(--canvas)",
        surface:         "var(--surface)",
        background:      "var(--background)",
        foreground:      "var(--foreground)",
      },
      fontFamily: {
        sans:    ["var(--font-body)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "75ch",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
