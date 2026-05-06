// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        accent: "var(--accent-hover)",
        bgDark: "var(--bg-dark)",
        cardDark: "var(--card-dark)",
      },
    },
  },
  plugins: [],
};
