/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Figtree', 'Segoe UI', 'sans-serif']
      },
      colors: {
        slateBlue: '#1f2a44',
        accentSun: '#f59e0b',
        threatHigh: '#dc2626',
        threatMedium: '#ea580c',
        threatLow: '#16a34a'
      },
      boxShadow: {
        panel: '0 12px 40px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
}
