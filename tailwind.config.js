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
          DEFAULT: '#10a37f',
          hover: '#0d8a6a',
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
      },
    },
  },
  plugins: [],
}
