/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#FFFDF7', 100: '#FFF9E6', 200: '#FFF3CC' },
        warm: {
          50: '#FDF8F4',
          100: '#FAF0E6',
          200: '#F5E1D0',
          300: '#EECDB5',
          400: '#E8B896',
          500: '#E0A07A',
          600: '#D4876B',
          700: '#C46D52',
          800: '#A85A3E',
          900: '#7A3F2B',
        },
        olive: { 50: '#F5F7F0', 100: '#E8EDDA', 200: '#D5DEB8', 300: '#B8C98E', 400: '#9BB56E' },
        sage: { 50: '#F0F4F1', 100: '#D8E4DA', 200: '#B0C9B4', 300: '#88AE8E' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

