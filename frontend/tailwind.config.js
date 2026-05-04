/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          500: '#6366F1',
        },
        navy: {
          900: '#0F172A',
        },
        whiteish: {
          50: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      }
    },
  },
  plugins: [],
}
