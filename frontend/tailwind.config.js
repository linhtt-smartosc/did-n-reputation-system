/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    }
  },
  daisyui: {
    themes: [{
      mytheme: {
        "primary": "#071952",
        "secondary": "#6C48C5",
        "accent": "#C68FE6",
        "neutral": "#f5d0fe",
        "base-100": "#ffffff",
        "info": "#3b82f6",
        "success": "#86efac",
        "warning": "#fde047",
        "error": "#ef4444",
      },
    }]
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('daisyui'),
    require("@tailwindcss/forms")
  ],
}

