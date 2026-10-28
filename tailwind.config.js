/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#006E96', // Primary Brand Blue
          700: '#005474',
          800: '#00425c',
          900: '#003348',
        },
        emerald: {
          600: '#0D5C46', // Classic Madrasa Emerald
          700: '#094333',
        },
        gold: {
          400: '#E5C058',
          500: '#D4AF37', // Elegant Accent Gold
          600: '#B89726',
        }
      },
      fontFamily: {
        bangla: ['"Hind Siliguri"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
