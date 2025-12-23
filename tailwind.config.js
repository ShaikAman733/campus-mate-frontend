/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Keeps your dark mode working
  theme: {
    extend: {
      // 1. ADD THE FONT HERE
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      // 2. KEEP YOUR ANIMATIONS HERE
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-up': 'scaleUp 0.3s ease-out forwards',
        'blink': 'blink 1s step-end infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },

  
  plugins: [],
}


