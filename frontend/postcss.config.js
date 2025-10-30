// Ruta: frontend/postcss.config.js (Volvemos a la sintaxis exigida)

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- Volvemos a usar el nombre del plugin
    autoprefixer: {},
  },
}