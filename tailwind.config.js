/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f0a",
        surface: "#111811",
        "surface-2": "#161e16",
        "surface-3": "#1a241a",
        border: "#1f2d1f",
        "border-2": "#243224",
        accent: "#22c55e",
        "accent-dim": "#16a34a",
        "accent-muted": "#14532d",
        "accent-glow": "rgba(34,197,94,0.15)",
        text: "#e8f5e8",
        "text-muted": "#6b8a6b",
        "text-dim": "#4a644a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        urbanist: ["var(--font-urbanist)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
        display: ["var(--font-urbanist)", "system-ui"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "green-glow": "radial-gradient(ellipse at bottom, rgba(34,197,94,0.2) 0%, transparent 60%)",
        "sidebar-gradient": "linear-gradient(180deg, #111811 0%, #0d150d 100%)",
      },
      boxShadow: {
        "green-sm": "0 0 10px rgba(34,197,94,0.2)",
        "green-md": "0 0 20px rgba(34,197,94,0.25)",
        "green-lg": "0 0 40px rgba(34,197,94,0.3)",
        "inner-green": "inset 0 0 20px rgba(34,197,94,0.05)",
      },
      animation: {
        "pulse-green": "pulse-green 2s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
      },
      keyframes: {
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(34,197,94,0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(34,197,94,0.4)" },
        },
        "slide-in": {
          from: { transform: "translateX(-10px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
