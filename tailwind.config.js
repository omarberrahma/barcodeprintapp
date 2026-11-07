/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
          sans: ['Tajawal', 'sans-serif'],
          en: ['Inter', 'sans-serif']
      },
      colors: {
          primary: '#4f46e5',
          primary_dark: '#4338ca',
          secondary: '#10b981',
          secondary_dark: '#059669',
      }
    },
  },
  plugins: [],
}