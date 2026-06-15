/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#e6a80b",
          50:  "#fef9e7",
          100: "#fdf0c0",
          200: "#fae08a",
          300: "#f6ca4a",
          400: "#f0b420",
          500: "#e6a80b",
          600: "#c98506",
          700: "#a86309",
          800: "#8a4e10",
          900: "#724113",
        },
        brand: {
          black: "#000000",
          white: "#ffffff",
          gray:  "#111111",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
