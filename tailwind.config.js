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
          navy: '#f0fdf4',
          'navy-mid': '#f0fdf4',
          'navy-light': '#dcfce7',
          sky: '#6b7280',
          gold: '#059669',
          'gold-light': '#10b981',
          cream: '#374151',
          'warm-bg': '#f9fafb',
          panel: '#ffffff'
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
