const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        inputbkgrd: "#F8F8F8",
        primaryblue: "#02A1FD",
        secondaryblue: "#2255FF",
        btngreen: "#34B53A",
        btnred: "#EB6402",
        bgicongreen: "#E2FBD7",
        bgiconred: "#FFE5D3",
        activelink: "#ECECEC",
      },
    },
    fontFamily: {
      MADEOKINESANSPERSONALUSE: 'MADEOKINESANSPERSONALUSE, sans-serif',
      MontserratRegular: 'Montserrat-Regular, sans-serif',
      MontserratLight: 'Montserrat-Light, sans-serif',
      MontserratSemiBold: 'Montserrat-SemiBold, sans-serif',
      MontserratBold: 'Montserrat-Bold, sans-serif',
    }
  },
  plugins: [],
  important: true,
});
