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
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        secondary: {
          100: '#FCE7F3',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
        },
        accent: {
          green: '#10B981',
          yellow: '#F59E0B',
          red: '#EF4444',
          blue: '#3B82F6',
          purple: '#8B5CF6',
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
