/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E8642C", // Saffron
          hover: "#D1541F",
          light: "#FFF4F0",
        },
      },
      fontFamily: {
        sans: ["Geist", "Inter", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
}
