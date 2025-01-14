import * as container from "@tailwindcss/container-queries"

function makeColors(color: string) {
  const obj: any = {}
  ;[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].forEach((weight) => {
    obj[weight] = `rgb(var(--color-${color}-${weight}) / var(--tw-text-opacity, 1))`
  })
  return obj
}

const cus_colors = {
  primary: makeColors("primary"),
  error: makeColors("error"),
  // danger: makeColors("danger"),
  success: makeColors("success"),
  warning: makeColors("warning"),
  info: makeColors("info"),
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...cus_colors,
      },
    },
  },
  plugins: [container],
}
