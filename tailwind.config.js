/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      colors: {
        twilight: {
          darkest: '#0B0A10',  // Even darker for better contrast with neon
          dark: '#1C1930',     
          base: '#2D284B',     
          lavender: '#B5A8D5', 
          pink: '#EAA9B8',     
          yellow: '#FDE481',   
          cream: '#FEFCF5'     
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-inner': 'inset 0 1px 2px rgba(255, 255, 255, 0.1)',
        'neon-yellow': '0 0 10px rgba(253, 228, 129, 0.5), 0 0 20px rgba(253, 228, 129, 0.3)',
        'neon-pink': '0 0 15px rgba(234, 169, 184, 0.5), inset 0 0 10px rgba(234, 169, 184, 0.3)',
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow 4s ease-in-out infinite',
        'particle-drift': 'drift 15s linear infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.4' },
          '50%': { transform: 'scale(1.1)', opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(253, 228, 129, 0.1))' },
          '50%': { filter: 'drop-shadow(0 0 25px rgba(253, 228, 129, 0.5))' },
        },
        drift: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '20%': { opacity: '0.8' },
          '80%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-100vh) translateX(50px)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
