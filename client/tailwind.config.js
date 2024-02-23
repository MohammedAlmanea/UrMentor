/** @type {import('tailwindcss').Config} */
const typography = require('@tailwindcss/typography');
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
  ],
}

