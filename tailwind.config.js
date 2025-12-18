/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Inherit system font stack per ChatGPT UI guidelines
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // ChatGPT-compatible color tokens
        primary: {
          DEFAULT: '#1b2b48',
          hover: '#2a3c5f',
        },
        surface: {
          light: '#ffffff',
          dark: '#343541',
        },
        text: {
          primary: {
            light: '#1a1a1a',
            dark: '#ececf1',
          },
          secondary: {
            light: '#6b6b6b',
            dark: '#8e8ea0',
          },
        },
        border: {
          light: '#e5e5e5',
          dark: '#4e4f60',
        },
        // Morgan & Morgan brand colors
        morgan: {
          gold: '#FDEB0E',
          blue: '#1a365d',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
