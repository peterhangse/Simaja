/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sims-green': {
          DEFAULT: '#00a651',
          light: '#7fff7f',
          dark: '#006d35'
        },
        'sims-pink': '#e91e63',
        'sims-blue': '#2196f3',
        'sims2': {
          navy: '#0f2438',
          'navy-mid': '#162d48',
          'navy-light': '#1e3a5c',
          sky: '#6ba3d6',
          gold: '#d4a84c',
          'gold-light': '#f0d97a',
          cream: '#e8dfc8',
          'warm-bg': '#162d48',
          panel: '#162d48'
        }
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' }
        }
      }
    },
  },
  plugins: [],
}
