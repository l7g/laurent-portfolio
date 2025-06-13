import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        saffron: {
          50: "#fefbf3",
          100: "#fef6e7",
          200: "#fdebc4",
          300: "#fbda96",
          400: "#f8c466",
          500: "#f5b041",
          600: "#f39c12",
          700: "#e67e22",
          800: "#d68910",
          900: "#b7670f",
          950: "#714005",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#fefbf3",
              100: "#fef6e7",
              200: "#fdebc4",
              300: "#fbda96",
              400: "#f8c466",
              500: "#f5b041",
              600: "#f39c12",
              700: "#e67e22",
              800: "#d68910",
              900: "#b7670f",
              DEFAULT: "#f39c12",
              foreground: "#ffffff",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              50: "#fefbf3",
              100: "#fef6e7",
              200: "#fdebc4",
              300: "#fbda96",
              400: "#f8c466",
              500: "#f5b041",
              600: "#f39c12",
              700: "#e67e22",
              800: "#d68910",
              900: "#b7670f",
              DEFAULT: "#f39c12",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};

module.exports = config;
