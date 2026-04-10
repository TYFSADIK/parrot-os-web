/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parrot: {
          bg: '#1a1a2e',
          panel: '#16213e',
          accent: '#00d4aa',
          'accent-dark': '#00a882',
          terminal: '#0d0d0d',
          'terminal-text': '#00d4aa',
          surface: '#0f3460',
          border: '#2a2a4a',
        }
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
        mono: ['Ubuntu Mono', 'monospace'],
      }
    }
  },
  plugins: [],
}
