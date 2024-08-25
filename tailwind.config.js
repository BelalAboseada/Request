/* eslint-disable no-undef */
module.exports = {
  mode: "jit",
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/@material-tailwind/react/components/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: "var(--red)",
        blue: "var(--blue)",
        gray: {
          DEFAULT: "var(--gray)",
          dark: "var(--gray-dark)",
          md: "var(--gray-md)",
        },
        gold: "var(--gold)",
        yellow: "var(--yellow)",
        green: "var(--green)",
        light: "var(--light)",
        purple: {
          DEFAULT: "var(--purple)",
          dark: "var(--purple2)",
        },
      },
      backgroundImage: {
        linear_1: "var(--linear1)",
        linear_2: "var(--linear2)",
        linear_3: "var(--linear3)",
        linear_4: "var(--linear4)",
        linear_5: "var(--linear5)",
      },
      fontFamily: {
        inter: ['"Inter"', "sans-serif"],
        poppins: ['"Poppins"', "sans-serif"],
        workSans: ['"Poppins"', "sans-serif"],
        jost: ['"jost"', "sans-serif"],
      },
      shadow: {
        dark: "var(--shadow-dark)",
        medium: "var(--shadow-medium)",
      },
      transitionProperty: {
        custom: "all",
      },
      transitionTimingFunction: {
        custom: "ease-in-out",
      },
      transitionDuration: {
        custom: "0.5s",
      },
    },
  },
  plugins: [],
};