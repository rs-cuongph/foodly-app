import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    prefix: "nextui", // prefix for themes variables
    addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
    defaultTheme: "light", // default theme from the themes object
    defaultExtendTheme: "light", // default theme to extend on custom themes
    layout: {}, // common layout tokens (applied to all themes)
    themes: {
      screens: {
        'xs': '320px',
        // => @media (min-width: 350px) { ... }
  
        'xss': '425px',
        // => @media (min-width: 425px) { ... }
  
        'sm': '576px',
        // => @media (min-width: 576px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
      light: {
        layout: {}, // light theme layout tokens
        colors: {
          background: "#ffffff",
          foreground: "#ffffff",
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
            default: "#fe6137",
            foreground: "#fff"
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
            default: "#f21616",
            foreground: "#fff"
          },
          focus: "#fe6137",
        }, // light theme colors
      },
      dark: {
        layout: {}, // dark theme layout tokens
        colors: {}, // dark theme colors
      },
      // ... custom themes
    },
  })],
}
