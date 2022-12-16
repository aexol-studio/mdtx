const plugin = require('tailwindcss/plugin');
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        jost: ['var(--jost-font)', ...fontFamily.serif],
        jostlight: ['var(--jost-font-light)', ...fontFamily.serif],
        ivymode: ['var(--ivymode-font)', ...fontFamily.serif],
        lato: ['var(--lato-font)', ...fontFamily.serif],
      },
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
        'landing-background': '#E4E9EF',
        'landing-gray-text': '#C8C8C8',
        'landing-gray0': '#545454',
        'landing-gray1': '#8F8F8F',
        'landing-yellow': '#F4FD3A',
        'landing-black': '#0B0B0F',
        'landing-text-black': '#060606',
        'landing-white': '#E4E9EF',
        'landing-blue': '#005EEE',
        'editor-blue1': '#005EEE',
        'editor-blue2': '#477FD3',
        'editor-orange': '#E4B068',
        'editor-yellow1': '#F4FD3A',
        'editor-yellow2': '#C8CD55',
        'editor-purple1': '#8484A1',
        'editor-purple2': '#9A99AD',
        'editor-light1': '#FAFAFE',
        'editor-light2': '#E1E5EE',
        'editor-black1': '#272839',
        'editor-black2': '#1E1E2C',
        'editor-black3': '#11111D',
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
        fullmoon:
          'linear-gradient(16.22deg, rgba(255, 255, 255, 0.6) 9.9%, rgba(255, 255, 255, 0) 89.3%)',
        background: "url('/background.png')",
        gradient0:
          'linear-gradient(96.73deg, #0A6AFD -16.84%, rgba(10, 106, 253, 0) 128.26%)',
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
        backgroundShadow: '0px 4px 190px rgba(110, 137, 177, 0.46)',
        mdtxShadow1: '10px 3px 40px rgba(34, 95, 139, 0.13)',
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
