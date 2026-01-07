/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wabi: {
          50: '#F9F9F8', 100: '#F2F1EF', 300: '#D1CFCB',
          500: '#8A8886', 700: '#5C5A58', 900: '#2E2D2C'
        }
      },
      boxShadow: { 'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)' }
    },
  },
  plugins: [],
}