const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
      minHeight: {
        0: "0",
        "1/4": "25vh",
        "1/2": "50vh",
        "3/4": "75vh",
        full: "100vh",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
