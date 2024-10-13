/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        soon: "var(--soon-color-primary)",
        "soon-light": "var(--soon-menu-hover-bg-color)",
      },
    },
  },
  plugins: [],
}
