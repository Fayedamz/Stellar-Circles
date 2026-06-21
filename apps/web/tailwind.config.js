/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Stellar Circles brand palette
        brand: {
          50:  "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc8fb",
          400: "#36aaf5",
          500: "#0c8fe6",  // primary
          600: "#0070c0",
          700: "#005a9c",
          800: "#054d81",
          900: "#0a416b",
          950: "#072a49",
        },
        circle: {
          learning: "#6366f1", // indigo
          business: "#f59e0b", // amber
          fitness:  "#10b981", // emerald
          farming:  "#84cc16", // lime
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
