/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dce6ff',
          200: '#b9cdff',
          300: '#84a9ff',
          400: '#527bff',
          500: '#2d52ff',
          600: '#1a33f5',
          700: '#1426e1',
          800: '#1621b5',
          900: '#18228f',
          950: '#111557',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0f1117',
          card: '#f8f9fc',
          'card-dark': '#161b27',
          border: '#e2e8f4',
          'border-dark': '#1e2535',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
