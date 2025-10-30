// Ruta: frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- ESTA ES LA RUTA CRUCIAL
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}