import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "320px",
      // => @media (min-width: 350px) { ... }

      xss: "425px",
      // => @media (min-width: 425px) { ... }

      sm: "576px",
      // => @media (min-width: 576px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      backgroundImage: {
        banner: "url('/images/banner-img.jpeg')",
      },
      colors: {
        "dark-gray": "#1E1E1E",
        "coral-orange": "#FE724C",
        "coral-orange-40": "#FE724C40",
        "translucent-black": "#00000040",
        "semi-translucent-black": "#0000008C",
        "light-gray": "#D9D9D980",
        "primary-default": "#205FFE",
      },
      boxShadow: {
        "sunset": "0px 2px 4px 0px #FE724C"
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui", // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: "light", // default theme from the themes object
      defaultExtendTheme: "light", // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {
            // background: "#ffffff",
            // foreground: "#ffffff",
            primary: {
              50: "#ffece4",
              100: "#ffd8cd",
              200: "#ffb09a",
              300: "#ff8564",
              400: "#fe6137",
              500: "#fe4a19",
              600: "#ff3d09",
              700: "#e32e00",
              800: "#cb2700",
              900: "#b11c00",
              DEFAULT: "#fe724c",
              foreground: "#fff",
            },
            danger: {
              50: "#ffe9e9",
              100: "#ffd1d1",
              200: "#fba0a1",
              300: "#f76d6d",
              400: "#f34141",
              500: "#f22625",
              600: "#f21616",
              700: "#d8070b",
              800: "#c10008",
              900: "#a90003",
              DEFAULT: "#dc2626",
              foreground: "#fff",
            },
            focus: "#fe6137",
          }, // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {}, // dark theme colors
        },
      },
    }),
  ],
};
