/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'priority-p1': '#ef4444',
        'priority-p2': '#f97316',
        'priority-p3': '#eab308',
        'priority-p4': '#22c55e',
      }
    },
  },
  plugins: [],
} 