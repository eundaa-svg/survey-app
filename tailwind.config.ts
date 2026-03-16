import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ede7f6",
          100: "#d1c4e9",
          200: "#b39ddb",
          300: "#9575cd",
          400: "#7e57c2",
          500: "#673ab7",
          600: "#5e35b1",
          700: "#512da8",
          800: "#4527a0",
          900: "#311b92",
        },
        success: "#4caf50",
        warning: "#ff9800",
        danger: "#f44336",
        background: "#f0ebf8",
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Noto Sans KR"', "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.2s ease-in",
        "fade-in": "fadeIn 0.2s ease-out",
        "toast-in": "toastIn 0.3s ease-out",
        "toast-out": "toastOut 0.2s ease-in forwards",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        toastIn: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        toastOut: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
