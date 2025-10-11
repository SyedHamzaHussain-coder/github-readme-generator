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
          DEFAULT: '#556B2F',
          dark: '#3d4d21',
          light: '#6d8a3a',
        },
        secondary: {
          DEFAULT: '#8FA31E',
          dark: '#6f8015',
          light: '#a8bc35',
        },
        accent: {
          DEFAULT: '#C6D870',
          dark: '#b4c65a',
          light: '#d5e490',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
