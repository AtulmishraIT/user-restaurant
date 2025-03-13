/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'left': '-10px 0px 15px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        loading: {
          '0%': { width: '0%', left: '0%' },
          '50%': { width: '2000%', left: '0%' },
          '100%': { width: '0%', left: '100%' },
        },
      },
      animation: {
        loading: 'loading 2.5s infinite',
      },
      fontFamily: {
        'roboto-condensed': ['Roboto Condensed', 'serif'],
        'noto-serif-bengali': ['Noto Serif Bengali', 'serif'],
      },
      fontWeight: {
        '100': 100,
        '200': 200,
        '300': 300,
        '400': 400,
        '500': 500,
        '600': 600,
        '700': 700,
        '800': 800,
        '900': 900,
      },
    },
    color: {
      'custom-blue': {
          default: '#282c3f', // Default shade
          100: '#3a3f5a',     // Lighter shade
          200: '#1e2233',     // Darker shade
        },
    },
  },
  variants: {},
  plugins: [],
};

