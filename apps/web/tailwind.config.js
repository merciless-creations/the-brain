/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          400: '#6B7BC8',
          500: '#5B6BC2',
          600: '#4C5BAD',
          700: '#3D4A8F',
        },
        secondary: {
          100: '#FCE7F3',
          400: '#C95D94',
          500: '#B84D84',
          600: '#A33D6F',
        },
        accent: {
          green: '#0D9668',
          yellow: '#C17D08',
          red: '#C43636',
          blue: '#2E68C4',
          purple: '#6E4AC4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
      },
      maxWidth: {
        'prose': '65ch',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}
