/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Custom colors for nodes
        'node-trigger': {
          DEFAULT: '#ef4444', // red-500
          dark: '#b91c1c', // red-700
        },
        'node-agent': {
          DEFAULT: '#3b82f6', // blue-500
          dark: '#1d4ed8', // blue-700
        },
        'node-condition': {
          DEFAULT: '#a855f7', // purple-500
          dark: '#7e22ce', // purple-700
        },
        'node-action': {
          DEFAULT: '#22c55e', // green-500
          dark: '#15803d', // green-700
        },
        'node-tool': {
          DEFAULT: '#eab308', // yellow-500
          dark: '#a16207', // yellow-700
        },
      },
      boxShadow: {
        node: '0 2px 4px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1)',
        'node-selected': '0 0 0 2px #3b82f6, 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
