export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  plugins: ['~/plugins/chart.ts'],
  runtimeConfig: {
    useDummyOnly: process.env.NUXT_USE_DUMMY_ONLY ?? 'true',
    xBearerToken: '',
    xApiBase: 'https://api.x.com/2',
    instagramAccessToken: '',
    instagramApiBase: 'https://graph.instagram.com',
    instagramBusinessId: '',
    public: {
      dashboardName: 'Pussiberad Social Monitor'
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  experimental: {
    appManifest: false
  },
  tailwindcss: {
    viewer: false
  }
})

