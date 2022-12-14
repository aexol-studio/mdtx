const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mdtxBlack: '#11111D',
        mdtxBlack1: '#1E1E2C',
        mdtxWhite: '#FFFFFF',
        mdtxOrange0: '#FF9800',
        mdtxOrange1: '#FF7200',
        mediumGray: '#939BA1',
        darkGray: '#232A2F',
        gray2: '#E6E6E6',
        gray3: '#B5BFCA',
        editorWhite: '#E4E9EF',
        editorBlack: '#0B0B0F',
        editorYellow: '#F4FD3A',
        editorBlue: '#005EEE',
        editorGray0: '#8F8F8F',
        editorGray1: '#545454',
      },
      keyframes: {
        mdtxPulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      animation: {
        mdtxPulse: 'mdtxPulse 4s ease-in-out infinite',
      },
      backgroundImage: {
        gradientBlue0:
          'linear-gradient(180deg, #418CFD 0%, rgba(92, 47, 235, 0) 100%)',
        gradientOrange0: 'linear-gradient(180deg, #B17214 0%, #7A5723 100%)',
      },
      screens: {
        ssm: '480px',
      },
      animation: {
        showToast: 'showToast 2000ms ease-in-out',
      },
      boxShadow: {
        mdtxShadow0: '0px 4px 8px 0px rgba(255, 114, 0, 0.2)',
      },
      keyframes: {
        showToast: {
          '0%': { opacity: 0.2 },
          '35%': { opacity: 1 },
          '80%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        html: {
          fontSize: '62.5%',
        },
      });
    }),
    require('@tailwindcss/typography'),
  ],
};
