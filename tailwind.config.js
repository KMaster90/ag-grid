module.exports = {
  mode: 'jit',
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
    safelist: [
      { pattern: /.*/ },
    ],
}
