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
        midnight: {
          bg: '#0a0512',
          surface: '#130d20',
          card: '#1a102b',
          cardHover: '#23163a',
          border: 'rgba(217, 70, 239, 0.15)',
          borderGlow: 'rgba(217, 70, 239, 0.4)',
          accent: '#d946ef',
          accentPink: '#ec4899',
          accentPurple: '#a855f7',
          textMuted: '#94a3b8',
          textLight: '#f1f5f9',
        },
        bubblegum: {
          bg: '#ffdbe8',
          surface: '#fff0f5',
          card: '#ffffff',
          cardHover: '#fff5f8',
          border: 'rgba(244, 114, 182, 0.3)',
          borderGlow: 'rgba(236, 72, 153, 0.5)',
          accent: '#ec4899',
          accentDeep: '#db2777',
          textDark: '#1e1b4b',
          textMuted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        cursive: ['Caveat', 'Playwrite', 'cursive'],
      },
      boxShadow: {
        'glow-pink': '0 0 25px -5px rgba(236, 72, 153, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
        'bubblegum-soft': '0 10px 25px -5px rgba(244, 114, 182, 0.25), 0 8px 10px -6px rgba(244, 114, 182, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
