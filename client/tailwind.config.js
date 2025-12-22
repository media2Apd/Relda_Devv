/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#e60000",      // main brand color
          primaryHover: "#c00202", // hover / active
          primarySoft: "#ff4d4d",  // light usage
          primaryTextMuted: "#616161",     // paragraph / secondary heading
          textMuted: "#6A7282",     // paragraph / secondary heading
          offer: "#4F9835",         // offer / discount / success
          productCardImageBg: "#F0F2F5",         // product card img bg
          productCardBorder: "#E5E5E5",         // product card img bg
          buttonAccent: '#0b8524',//green->button
          buttonAccentHover: '#074916',
          buttonSecondary: '#033dfc', //blue->button
          buttonSecondaryHover: '#030bfc',
        },
      },
      animation: {
        progress: "progress 3s linear forwards",
        grow: 'grow 2s ease-in-out forwards',
        'grow-sm': 'grow-sm 2s ease-in-out forwards', // Separate small-screen animation
      },
      keyframes: {
        grow: {
          '0%': { width: '0%' },
          '100%': { width: '350%' }, // Default for large screens
        },
        'grow-sm': {
          '0%': { height: '0%' },
          '100%': { height: '180%' }, // Smaller width for small screens
        },
        progress: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
    },
  },
  plugins: [],
};
