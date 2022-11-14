/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/assets/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mdtxBlack: '#111111',
        mdtxWhite: '#FFFFFF',
        mdtxOrange0: '#FF9800',
        mdtxOrange1: '#FF7200',
        mediumGray: '#939BA1',
        darkGray: '#232A2F',
        gray2: '#E6E6E6',
        gray3: '#B5BFCA',
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
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
