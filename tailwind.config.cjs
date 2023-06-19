/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "default-bg": "rgb(1, 5, 36)",
        "main-bg":
          "radial-gradient(ellipse 200px 200px at 30% 40%,#3360ff,transparent), radial-gradient(200px 200px at 70% 60%,#3360ff,transparent)",
        secondary: "#6466f1",
      },
      boxShadow: {
        "subtle-t": "0px -1px 0px rgb(255,255,255,.09)",
        "subtle-r": "1px 0px 0px rgb(255,255,255,.09)",
        "subtle-b": "0px 1px 0px rgb(255,255,255,.09)",
      },
      keyframes: {
        "slide-up-fade": {
          "0%": { opacity: 0, transform: "translateY(2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "toast-slide-in-right": {
          "0%": { transform: `translateX(calc(100% + 1rem))` },
          "100%": { transform: "translateX(0)" },
        },
        "toast-swipe-out-x": {
          "0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          "100%": {
            transform: `translateX(calc(100% + 1rem))`,
          },
        },
      },
      animation: {
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-hide": "fade-out 100ms ease-in forwards",
        "toast-slide-in-right": "toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-swipe-out-x": "toast-swipe-out-x 100ms ease-out forwards",
      },
    },
  },
  plugins: [
    require("@savvywombat/tailwindcss-grid-areas"),
    require("tailwindcss-radix"),
    require("@tailwindcss/forms"),
  ],
};
