import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0d6e3f",
          light: "#15a85e",
          dark: "#094d2c",
          50: "#ecfdf3",
          100: "#d1fae0",
          200: "#a6f4c5",
          300: "#6ee7a0",
          400: "#34d376",
          500: "#0d6e3f",
          600: "#0a5832",
          700: "#094d2c",
          800: "#073d23",
          900: "#05321d",
        },
        accent: {
          DEFAULT: "#e8a838",
          light: "#f0c060",
          dark: "#c48820",
        },
        cameroon: {
          green: "#007a33",
          red: "#ce1126",
          yellow: "#fcd116",
        },
        canada: {
          red: "#ff0000",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;