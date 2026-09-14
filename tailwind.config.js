/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0b0a',
        cream: '#f4f4ef',
        brand: {
          green: '#1e5632',
          live: '#4aa870',
        },
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
};
