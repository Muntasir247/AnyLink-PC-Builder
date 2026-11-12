import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          lowest: "var(--surface-container-lowest)",
          low: "var(--surface-container-low)",
          container: "var(--surface-container)",
          high: "var(--surface-container-high)",
          highest: "var(--surface-container-highest)",
        },
        "on-surface": {
          DEFAULT: "var(--on-surface)",
          variant: "var(--on-surface-variant)",
          muted: "var(--on-surface-muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--on-primary)",
        },
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        card: "20px",
        control: "12px",
      },
      boxShadow: {
        glass: "inset 0 1px 0 0 rgba(255, 255, 255, 0.15)",
        "glass-elevated":
          "inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 0 24px 48px -12px rgba(0, 0, 0, 0.50)",
        "glass-light":
          "inset 0 1px 0 0 rgba(255, 255, 255, 0.80), 0 8px 32px rgba(0, 0, 0, 0.06)",
      },
      backdropBlur: {
        glass: "24px",
        "glass-elevated": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
